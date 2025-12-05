// src/screens/admin/AdminDashboard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../../navigation/AdminStack';
import Header from '../../components/header';
import { useAuth } from '../../Auth/AuthContext'; 

export default function AdminDashboard() {
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {user && (
        <Text style={styles.adminText}>Xin chào: {user.username}</Text>
      )}

      <Text style={styles.title}>📊 Admin Dashboard</Text>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ManageUsers')}>
        <Text style={styles.btnText}>👤 Quản lý User</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ManageCategories')}>
        <Text style={styles.btnText}>📂 Quản lý Loại sản phẩm</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ManageProducts')}>
        <Text style={styles.btnText}>📦 Quản lý Sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  adminText: { fontSize: 18, fontWeight: '600', color: '#E91E63', marginBottom: 10, textAlign: 'center', backgroundColor: '#ffe6f0', padding: 10, borderRadius: 8  },
  btn: { backgroundColor: '#03a9f4', padding: 15, borderRadius: 8, marginVertical: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});