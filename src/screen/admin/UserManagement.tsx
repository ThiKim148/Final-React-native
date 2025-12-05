// src/screens/admin/ManageUsers.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, Button
} from 'react-native';
import { fetchUsers, deleteUser, updateUserRole } from '../../database/data';
import { User } from '../../navigation/types';
import { Picker } from '@react-native-picker/picker';

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');

  const loadUsers = async () => {
    const list = await fetchUsers();
    setUsers(list);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = (id: number) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa user này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteUser(id);
            Alert.alert('Thông báo', 'Đã xóa user');
            loadUsers();
          },
        },
      ]
    );
  };

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role as 'user' | 'admin');
    setRoleModalVisible(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;

    if (selectedRole === 'admin') {
      const existingAdmin = users.find(u => u.role === 'admin' && u.id !== selectedUser.id);
      if (existingAdmin) {
        Alert.alert('Lỗi', `Chỉ được phép có 1 admin duy nhất (${existingAdmin.username})`);
        return;
      }
    }

    await updateUserRole(selectedUser.id, selectedRole);
    Alert.alert('Thành công', `Đã đổi vai trò ${selectedUser.username} thành ${selectedRole}`);

    setRoleModalVisible(false);
    setSelectedUser(null);
    await loadUsers();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Quản lý User</Text>

      <FlatList
        data={users}
        keyExtractor={(u) => u.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item.username} ({item.role})</Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleOpenRoleModal(item)}
            >
              <Text style={styles.btnText}>Đổi vai trò</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.danger]}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.btnText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal đổi role */}
      <Modal visible={roleModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Đổi vai trò cho {selectedUser?.username}
            </Text>

            <Picker
              selectedValue={selectedRole}
              onValueChange={(val) => setSelectedRole(val)}
            >
              <Picker.Item label="User" value="user" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>

            <View style={styles.modalActions}>
              <Button title="Lưu" onPress={handleSaveRole} />
              <Button
                title="Hủy"
                color="red"
                onPress={() => setRoleModalVisible(false)}
              />
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  text: { flex: 1 },
  btn: { backgroundColor: '#03a9f4', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, marginHorizontal: 4 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  danger: { backgroundColor: '#e91e63' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});
