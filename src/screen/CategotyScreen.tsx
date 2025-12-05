// src/screens/CategoryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Category, HomeStackParamList } from '../navigation/types';
import { fetchCategories } from '../database/data';

type Props = NativeStackScreenProps<HomeStackParamList, 'Category'>;

export default function CategoryScreen({ navigation }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const list = await fetchCategories();
      setCategories(list);
    };
    load();
  }, []);

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ProductsByCategory', {
          categoryId: item.id,
          categoryName: item.name,
        })
      }
    >
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}> ←Trang chủ</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📂 Danh mục sản phẩm</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  card: {
    padding: 16,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 10,
  },
  name: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  backButton: {
    marginTop: 10,
    marginBottom: 20,
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