import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  initDatabase,
  fetchCategories,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProductsByNameOrCategory,
  // type Category,
  // type Product,
} from '../database/data';

import { Category, Product } from '../navigation/types';


const Sanpham = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      await initDatabase();
      await loadData();
    };
    init();
  }, []);

  const loadData = async () => {
    const cats = await fetchCategories();
    const prods = await fetchProducts();
    setCategories(cats);
    setProducts(prods.reverse());
  };


  const handleAddOrUpdate = async () => {
    if (!name || !price) return;

    const productData = {
      name,
      price: parseFloat(price),
      img: imageUri || 'bomber_jacket.jpg',
      categoryId,
    };

    try {
      if (editingId !== null) {
        await updateProduct({ id: editingId, ...productData });
        setEditingId(null);
      } else {
        await addProduct(productData);
      }
      setName('');
      setPrice('');
      setCategoryId(1);
      setImageUri(null);
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (id: number) => {
    const p = products.find((x) => x.id === id);
    if (p) {
      setName(p.name);
      setPrice(p.price.toString());
      setCategoryId(p.categoryId);
      setImageUri(p.img);
      setEditingId(p.id);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa sản phẩm này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteProduct(id);
            loadData();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (response.didCancel) {
        console.log('Người dùng đã hủy chọn ảnh');
      } else if (response.errorCode) {
        console.error('Lỗi:', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri ?? null); // lưu uri vào state
      }
    });
  };

  const getImageSource = (img: string) => {
    if (img.startsWith('file://')) {
      return { uri: img };
    }
    switch (img) {
      case 'bomber_jacket.jpg':
        return require('../assets/products_images/bomber_jacket.jpg');
      case 'bomber_jacket.jpg':
        return require('../assets/products_images/bomber_jacket.jpg');
      default:
        return require('../assets/products_images/bomber_jacket.jpg');
    }
  };

  const handleSearch = async (keyword: string) => {
    if (keyword.trim() === '') {
      loadData();
    } else {
      const results = await searchProductsByNameOrCategory(keyword);
      setProducts(results.reverse());
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={getImageSource(item.img)} style={styles.image} />
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => handleEdit(item.id)}>
            <Text style={styles.icon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.icon}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quản lý sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={categoryId}
          onValueChange={(value) => setCategoryId(value)}
          style={styles.picker}
        >
          {categories.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        <Text style={styles.buttonText}>{imageUri ? 'Chọn lại hình ảnh' : 'Chọn hình ảnh'}</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image
          source={imageUri.startsWith('http') || imageUri.startsWith('file://')
            ? { uri: imageUri }
            : getImageSource(imageUri)}
          style={styles.selectedImage}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>
          {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
        </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Tìm theo tên sản phẩm hoặc loại"
        onChangeText={handleSearch}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Không có sản phẩm nào</Text>}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#28a',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginVertical: 10
  },
  cardInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  productPrice: {
    color: '#000'
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 10
  },
  icon: {
    fontSize: 20,
    marginRight: 10
  },
  pickerWrapper: {
    height: 55,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    flex: 1,
    padding: 1,
  },
  imagePicker: {
    backgroundColor: '#918',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default Sanpham;