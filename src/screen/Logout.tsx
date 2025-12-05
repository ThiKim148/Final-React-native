import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "../Auth/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function LogoutScreen() {
  const { setUser } = useAuth();
  const navigation = useNavigation() as any;

  const performLogout = async () => {
  try {
    await AsyncStorage.removeItem("userToken");
    setUser(null); // AppNavigator sẽ tự render Login
  } catch (error) {
    console.error("Logout error:", error);
  }
};

  const handleLogout = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có thật sự muốn đăng xuất?",
      [
        { text: "Không", style: "cancel" },
        { text: "Có", onPress: performLogout },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bạn đang ở màn hình Logout</Text>
      <Button title="Đăng xuất" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});