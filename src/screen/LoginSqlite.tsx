import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getUserByCredentials } from '../database/data';
import { useAuth } from "../Auth/AuthContext";

const LoginSqlite = () => {
const { setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  try {
    const user = await getUserByCredentials(username, password);
    if (!user) {
      Alert.alert("Lỗi", "Sai tên đăng nhập hoặc mật khẩu");
      return;
    }

    // ✅ chỉ cần setUser
    setUser({ username: user.username, role: user.role?.toLowerCase().trim() });
  } catch (error) {
    console.error(error);
    Alert.alert("Lỗi", "Đăng nhập thất bại");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        placeholder="Tên đăng nhập"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: { backgroundColor: '#6200ea', padding: 10, borderRadius: 5, marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default LoginSqlite;