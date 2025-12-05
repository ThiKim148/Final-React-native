// src/screen/OrderHistoryScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

const OrderHistoryScreen = () => {
  const { orders } = useCart();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Lịch sử đơn hàng</Text>

      {orders.length === 0 ? (
        <Text style={styles.empty}>Bạn chưa có đơn hàng nào</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(order) => order.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.order}>
              <Text style={styles.orderId}>Đơn #{item.id}</Text>
              <Text style={styles.date}>Ngày: {item.date}</Text>
              <Text style={styles.total}>Tổng tiền: {item.total}₫</Text>
              <View style={styles.items}>
                {item.items.map((p) => (
                  <Text key={p.id} style={styles.itemText}>
                    - {p.name} x {p.quantity}
                  </Text>
                ))}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  empty: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
  order: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderId: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  date: { fontSize: 14, color: '#555', marginBottom: 5 },
  total: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  items: { marginLeft: 10 },
  itemText: { fontSize: 14, color: '#333' },
});

export default OrderHistoryScreen;