import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Button,
  Image,
} from 'react-native';
import { fetchCategories, updateCategory, executeSql, addProduct } from '../../database/data';
import { Category } from '../../navigation/types';
import { productImages } from '../../utils/ImageMap';


export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Modal thêm sản phẩm
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImageKey, setProductImageKey] = useState('bomber_jacket');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Load categories từ DB
  const loadCategories = async () => {
    const list = await fetchCategories();
    setCategories(list);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Thêm category
  const addCategory = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Tên danh mục không được để trống');
      return;
    }
    await executeSql('INSERT INTO categories (name) VALUES (?)', [name.trim()]);
    setName('');
    loadCategories();
  };

  // Xóa category
  const deleteCategory = async (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa danh mục này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await executeSql('DELETE FROM categories WHERE id = ?', [id]);
          Alert.alert('Thông báo', 'Đã xóa danh mục');
          loadCategories();
        },
      },
    ]);
  };

  // Mở modal sửa category
  const handleUpdateCategory = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setModalVisible(true);
  };

  // Lưu sửa category
  const saveCategory = async () => {
    if (editingCategory) {
      if (!editName.trim()) {
        Alert.alert('Lỗi', 'Tên danh mục không được để trống');
        return;
      }
      await updateCategory(editingCategory.id, editName.trim());
      Alert.alert('Thông báo', 'Đã sửa category');
      setModalVisible(false);
      const updated = await fetchCategories();
      setCategories(updated);
    }
  };

  // Mở modal thêm sản phẩm cho category
  const handleAddProductToCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setProductName('');
    setProductPrice('');
    setProductImageKey('bomber_jacket');
    setProductModalVisible(true);
  };

  // Lưu sản phẩm vào category
  const saveProductToCategory = async () => {
    if (!productName.trim() || !productPrice.trim() || !selectedCategoryId) {
      Alert.alert('Lỗi', 'Tên và giá sản phẩm không được để trống');
      return;
    }
    await addProduct({
      name: productName.trim(),
      price: productPrice.trim(),
      image: productImageKey,
      categoryId: selectedCategoryId,
    });
    Alert.alert('Thông báo', 'Đã thêm sản phẩm vào danh mục');
    setProductModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📂 Quản lý Loại sản phẩm</Text>
      <TextInput
        placeholder="Tên danh mục"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TouchableOpacity style={styles.btn} onPress={addCategory}>
        <Text style={styles.btnText}>Thêm</Text>
      </TouchableOpacity>

      <FlatList
        data={categories}
        keyExtractor={(c) => c.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => deleteCategory(item.id)}>
                <Text style={styles.delete}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleUpdateCategory(item)}>
                <Text style={styles.edit}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddProductToCategory(item.id)}>
                <Text style={styles.add}>+ Sản phẩm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal sửa category */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sửa danh mục</Text>
            <TextInput
              placeholder="Tên mới"
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <Button title="Lưu" onPress={saveCategory} />
              <Button title="Hủy" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal thêm sản phẩm */}
      <Modal visible={productModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm sản phẩm</Text>

            {/* ✅ Hiển thị tên danh mục đang thêm */}
            {selectedCategoryId && (
              <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                Đang thêm sản phẩm cho danh mục:{' '}
                {categories.find(c => c.id === selectedCategoryId)?.name ?? '—'}
              </Text>
            )}

            <TextInput
              placeholder="Tên sản phẩm"
              value={productName}
              onChangeText={setProductName}
              style={styles.input}
            />
            <TextInput
              placeholder="Giá sản phẩm"
              value={productPrice}
              onChangeText={setProductPrice}
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
                <TouchableOpacity
                  onPress={() => setProductImageKey(item)}
                  style={{ marginHorizontal: 8, alignItems: 'center' }}
                >
                  <Image
                    source={productImages[item]}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      borderWidth: productImageKey === item ? 2 : 0,
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
                source={productImages[productImageKey]}
                style={{ width: 120, height: 120, borderRadius: 8 }}
              />
              <Text style={{ marginTop: 6 }}>{productImageKey}</Text>
            </View>

            <View style={styles.modalActions}>
              <Button title="Lưu" onPress={saveProductToCategory} />
              <Button title="Hủy" color="red" onPress={() => setProductModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  btn: { backgroundColor: '#03a9f4', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: 'bold' },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  categoryName: { fontSize: 16, fontWeight: '600' }, // 👈 thêm dòng này

  actions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  edit: { color: '#0a7', fontWeight: '600' },
  delete: { color: '#e53935', fontWeight: '600' },
  add: { color: '#2962ff', fontWeight: '600' },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});