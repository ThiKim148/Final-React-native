// src/screens/admin/ManageProducts.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet,
  TouchableOpacity, Alert, TextInput, Modal, Button
} from 'react-native';
import { Product, Category } from '../../navigation/types';
import {
  fetchCategories,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from '../../database/data';
import { Picker } from '@react-native-picker/picker';
import { productImages } from '../../utils/ImageMap';

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageKey, setImageKey] = useState<string>('bomber_jacket');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [isAdding, setIsAdding] = useState(false);

  // Load categories từ DB
  const loadCategories = async () => {
    const list = await fetchCategories();
    setCategories(list);
    if (list.length > 0 && categoryId === 0) setCategoryId(list[0].id);
  };

  // Load products từ DB
  const loadProducts = async () => {
    const list = await fetchProducts();
    setProducts(list);
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  // Xóa sản phẩm
  const handleDeleteProduct = (id: number) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa sản phẩm này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            await deleteProduct(id);
            Alert.alert("Thông báo", "Đã xóa sản phẩm");
            await loadProducts();
          },
        },
      ]
    );
  };

  // Mở modal thêm
  const handleAdd = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setImageKey('bomber_jacket');
    setCategoryId(categories.length ? categories[0].id : 0);
    setIsAdding(true);
    setModalVisible(true);
  };

  // Mở modal sửa
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setImageKey(product.image || 'bomber_jacket'); // đảm bảo là string key
    setCategoryId(product.categoryId);
    setIsAdding(false);
    setModalVisible(true);
  };

  // Lưu sản phẩm (thêm hoặc sửa)
  const saveProduct = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Lỗi', 'Tên và giá không được để trống');
      return;
    }

    if (isAdding) {
      await addProduct({
        name: name.trim(),
        price: price.trim(),
        image: imageKey, // ✅ lưu key string
        categoryId,
      });
    } else if (editingProduct) {
      await updateProduct({
        id: editingProduct.id,
        name: name.trim(),
        price: price.trim(),
        image: imageKey, // ✅ lưu key string
        categoryId,
      });
    }
    setModalVisible(false);
    await loadProducts();
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image
        source={productImages[item.image] || productImages['bomber_jacket']}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price} đ</Text>
        <Text style={styles.category}>
          Category: {categories.find(c => c.id === item.categoryId)?.name ?? '—'}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
          <Text style={styles.actionText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteProduct(item.id)}>
          <Text style={styles.actionText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Quản lý sản phẩm</Text>

      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={styles.addText}>+ Thêm sản phẩm</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal thêm/sửa */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isAdding ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}</Text>

            <TextInput
              placeholder="Tên sản phẩm"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Giá sản phẩm"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Chọn ảnh bằng FlatList */}
            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Chọn ảnh sản phẩm:</Text>
            <FlatList
              data={Object.keys(productImages)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setImageKey(item)} style={{ marginHorizontal: 8, alignItems: 'center' }}>
                  <Image
                    source={productImages[item]}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      borderWidth: imageKey === item ? 2 : 0,
                      borderColor: '#03a9f4',
                    }}
                  />
                  <Text style={{ marginTop: 4, fontSize: 12 }}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Preview ảnh đang chọn */}
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <Image
                source={productImages[imageKey]}
                style={{ width: 120, height: 120, borderRadius: 8 }}
              />
              <Text style={{ marginTop: 6 }}>{imageKey}</Text>
            </View>

            <Picker selectedValue={categoryId} onValueChange={(val) => setCategoryId(val)}>
              {categories.map(c => (
                <Picker.Item key={c.id} label={c.name} value={c.id} />
              ))}
            </Picker>

            <View style={styles.modalActions}>
              <Button title="Lưu" onPress={saveProduct} />
              <Button title="Hủy" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginBottom: 12, padding: 12, borderRadius: 8 },
  image: { width: 60, height: 60, borderRadius: 6, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, color: '#666', marginTop: 4 },
  category: { fontSize: 12, color: '#333', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#4CAF50', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, marginRight: 8 },
  deleteBtn: { backgroundColor: '#ff4d4d', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  actionText: { color: '#fff', fontWeight: 'bold' },
  addBtn: { backgroundColor: '#2196F3', padding: 10, borderRadius: 6, marginBottom: 12 },
  addText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginVertical: 6 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});

