// Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../Auth/AuthContext';

const Header = () => {
  const { user, setUser } = useAuth(); // lấy thông tin từ AuthContext

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>K.A Fashion</Text>

      {user ? (
        <View style={styles.right}>
          <Text style={styles.userText}>{user.username}</Text>
          <TouchableOpacity onPress={() => setUser(null)} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.userText}>Bạn chưa đăng nhập</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#E91E63',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userText: {
    color: '#fff',
    fontSize: 14,
  },
  logoutBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  logoutText: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
});

export default Header;