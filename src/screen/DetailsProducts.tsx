import React, { use, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Category, HomeStackParamList } from '../navigation/types';
import { fetchCategories } from '../database/data';
import CategorySelector from './CategorySelector';
import { useNavigation } from '@react-navigation/native';
import { productImages } from '../utils/ImageMap';


type DetailsScreenProps = NativeStackScreenProps<HomeStackParamList, 'Details'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ProductsByCategory'>;

const DetailsScreen = ({ route }: DetailsScreenProps) => {
  const { product } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const cat = await fetchCategories();
      setCategories(cat);
    }
    load();
  }, []);

  const handleSelectCategory = (id: number) => {
    const selected = categories.find((c) => c.id === id);
    if (selected) {
      console.log('Selected category:', selected);
      navigation.navigate('ProductsByCategory', {
        categoryId: selected.id,
        categoryName: selected.name, // nếu có
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}> ←Trang chủ</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Chi Tiết Sản Phẩm</Text>

      <Image source={productImages[product.image]} style={styles.productImage} />

      <Text style={styles.text}>Tên: {product.name}</Text>
      <Text style={styles.text}>Giá: {product.price}</Text>

      <Text style={styles.label}>Xem các sản phẩm khác:</Text>
      <CategorySelector
        categories={categories} // mảng categories do ProductDetailScreen fetch được
        selectedId={product.categoryId} // ID của loại sản phẩm hiện tại (dùng để highlight)
        onSelect={handleSelectCategory} // callback khi người dùng chọn loại sản phẩm
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    marginVertical: 5
  },
  productImage: {
    width: '100%',
    height: '50%',
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
  },
  label: { 
    marginTop: 20, 
    fontSize: 16, 
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    marginBottom: 50,
    width: "35%",
    marginRight: '70%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#E91E63',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});

export default DetailsScreen;