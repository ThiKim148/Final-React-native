import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Modal, TextInput, Button, Alert, Image
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { productImages } from '../utils/ImageMap'; // 👈 map key -> require ảnh

type CartScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Cart'>;

const CartScreen = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, checkout } = useCart();
  const navigation = useNavigation<CartScreenNavigationProp>();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const totalPrice = cart.reduce(
    (sum, item) => sum + parseInt(item.price) * (item.quantity || 1),
    0
  );

  const handleCheckout = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin nhận hàng');
      return;
    }
    if (!/^\d{9,11}$/.test(phone)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return;
    }

    checkout();
    setModalVisible(false);
    Alert.alert('Thành công', 'Đơn hàng đã được đặt');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      {/* ✅ Hiển thị ảnh sản phẩm */}
      <Image
        source={productImages[item.image] || productImages['bomber_jacket']}
        style={styles.productImage}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}₫ x {item.quantity}</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.actionBtn}>
            <Text>-</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.actionBtn}>
            <Text>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
            <Text style={{ color: '#fff' }}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Giỏ hàng</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Text style={styles.total}>Tổng tiền: {totalPrice}₫</Text>

      {/* Nút thanh toán */}
      <TouchableOpacity style={styles.checkout} onPress={() => setModalVisible(true)}>
        <Text style={styles.checkoutText}>Thanh toán</Text>
      </TouchableOpacity>

      {/* Nút xem lịch sử đơn hàng */}
      <TouchableOpacity
        style={[styles.checkout, { backgroundColor: '#009688' }]}
        onPress={() => navigation.navigate('OrderHistory')}
      >
        <Text style={styles.checkoutText}>Xem lịch sử đơn hàng</Text>
      </TouchableOpacity>

      {/* Modal nhập thông tin nhận hàng */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thông tin nhận hàng</Text>

            <TextInput
              placeholder="Họ tên"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <TextInput
              placeholder="Địa chỉ"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <Button title="Xác nhận" onPress={handleCheckout} />
              <Button title="Hủy" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 8, backgroundColor: '#fff', padding: 10, borderRadius: 8 },
  productImage: { width: 60, height: 60, borderRadius: 6, marginRight: 12 },
  productName: { fontSize: 16, fontWeight: '600' },
  productPrice: { fontSize: 14, color: '#666', marginTop: 4 },
  actions: { flexDirection: 'row', marginTop: 6 },
  actionBtn: { backgroundColor: '#eee', padding: 6, marginHorizontal: 4, borderRadius: 4 },
  removeBtn: { backgroundColor: '#f44336', padding: 6, marginLeft: 8, borderRadius: 4 },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  checkout: { backgroundColor: '#6200ea', padding: 12, borderRadius: 6, marginTop: 20 },
  checkoutText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginVertical: 6 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});

export default CartScreen;