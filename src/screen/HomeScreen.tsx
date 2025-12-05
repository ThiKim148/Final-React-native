// src/screens/Home.tsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Product, HomeStackParamList } from '../navigation/types';
import Header from '../components/header';
import { fetchProducts } from '../database/data';
import { productImages } from '../utils/ImageMap';
import { SafeAreaView } from 'react-native-safe-area-context';

type ProductsScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;


const Home = ({ navigation }: ProductsScreenProps) => {
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { addToCart } = useCart();

  // Load sản phẩm từ DB khi màn hình hiện
  useEffect(() => {
    const loadProducts = async () => {
      const list = await fetchProducts();
      setProducts(list);
    };
    loadProducts();
  }, []);

  // Hàm bỏ dấu tiếng Việt + bỏ khoảng trắng
  const normalizeText = (str?: string) =>
  (str ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();

  const filteredProducts = products.filter((p) => {
  const normalizedName = normalizeText(p.name);
  const normalizedSearch = normalizeText(searchText);
  const firstLetterMatch =
    searchText.length === 1 && normalizedName.startsWith(normalizedSearch);

  // Lọc theo tên sản phẩm hoặc tên danh mục
  const matchesText =
    normalizedName.includes(normalizedSearch) ||
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    firstLetterMatch ||
    normalizeText(p.categoryName).includes(normalizedSearch);

  // Lọc theo giá
  const price = parseInt(p.price);
  const min = minPrice ? parseInt(minPrice) : 0;
  const max = maxPrice ? parseInt(maxPrice) : Infinity;
  const matchesPrice = price >= min && price <= max;

  return matchesText && matchesPrice;
});

  // Render từng sản phẩm
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { product: item })}
        style={{ width: '100%' }}
      >
        <Image
          source={productImages[item.image] || productImages['bomber_jacket']} // 👈 map từ ImageKey
          style={styles.productImage}
        />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => {
          addToCart(item);
          navigation.navigate('Cart');
        }}
      >
        <Text style={styles.buyButtonText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left','right']}>
      {/* Header */}
      <Header />
      {/* Banner */}
      <Image source={require('../assets/products_images/banner.jpg')} style={styles.banner} />


      {/* Menu ngang */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Home')} >
          <Text style={styles.menuText}>Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Category')}>
          <Text style={styles.menuText}>Danh mục</Text>
        </TouchableOpacity>

        {/* Nút giỏ hàng */}
          <TouchableOpacity 
            onPress={() => navigation.navigate("Cart")} 
            style={styles.cartBtn}
          >
            <Text style={styles.cartText}>🛒</Text>
          </TouchableOpacity>

      </View>

      {/* Ô tìm kiếm */}
      <TextInput
        placeholder="Tìm kiếm sản phẩm..."
        style={styles.search}
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.priceFilter}>
        <TextInput
          placeholder="Giá từ..."
          keyboardType="numeric"
          style={styles.priceInput}
          value={minPrice}
          onChangeText={setMinPrice}
        />
        <TextInput
          placeholder="Đến..."
          keyboardType="numeric"
          style={styles.priceInput}
          value={maxPrice}
          onChangeText={setMaxPrice}
        />
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        style={styles.productList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    marginTop: 0,
  },
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
  },
  menuItem: {
    padding: 15
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10
  },
  
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  priceFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
  },
  productList: { flex: 1, },
  listContainer: { paddingHorizontal: 10, paddingBottom: 80 },
  productCard: {
    flex: 1,
    backgroundColor: '#eee',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 170,
    borderRadius: 10,
    resizeMode: 'cover'
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center'
  },
  productPrice: {
    fontSize: 14,
    color: '#E91E63',
    marginBottom: 10
  },
  cartBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 15,
  },
  cartText: {
    color: "#E91E63",
    fontWeight: "bold",
    fontSize: 16,
  },
  buyButton: {
    marginTop: 10,
    backgroundColor: '#E91E63',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13
  },
});

export default Home;