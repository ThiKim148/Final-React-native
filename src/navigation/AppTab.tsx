import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import { useAuth } from "../Auth/AuthContext";
import LoginSqlite from "../screen/LoginSqlite";
import SignupSqlite from "../screen/SignupSqlite";
import LogoutScreen from "../screen/Logout";
import { DetailProductStack } from "../navigation/DetailProductStack";
import  AdminTabs from "./AdminTabs";
import TopTabs from "./TopTabs";

const Tab = createBottomTabNavigator();

const AuthTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="Home"
      component={TopTabs}
      options={{
        title: "Home",
        tabBarIcon: ({ color, size }) => (
          <Text style={{ fontSize: size, color }}>🏠</Text>
        ),
      }}
    />

    <Tab.Screen
      name="Login"
      component={LoginSqlite}
      options={{
        title: "Login",
        tabBarIcon: ({ color, size }) => (
          <Text style={{ fontSize: size, color }}>🔒</Text>
        ),
      }}
    />
    <Tab.Screen
      name="Signup"
      component={SignupSqlite}
      options={{
        title: "Signup",
        tabBarIcon: ({ color, size }) => (
          <Text style={{ fontSize: size, color }}>➕</Text>
        ),
      }}
    />
    <Tab.Screen
      name="Logout"
      component={LogoutScreen}
      options={{
        title: "Logout",
        tabBarIcon: ({ color, size }) => (
          <Text style={{ fontSize: size, color }}>🚪</Text>
        ),
      }}
    />
  </Tab.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="HomeStack"
      component={DetailProductStack}
      options={{
        title: "Home",
        tabBarIcon: ({ color, size }) => (
          <Text style={{ fontSize: size, color }}>🏠</Text>
        ),
      }}
    />
    <Tab.Screen
      name="Logout"
      component={LogoutScreen}
      options={{
        title: "Logout",
        tabBarIcon: ({ color, size }) => (
          <Text style={{ fontSize: size, color }}>🚪</Text>
        ),
      }}
    />
  </Tab.Navigator>
);

export default function RootNavigator() {
  const { user } = useAuth();

  if (!user) return <AuthTabs />; // chưa đăng nhập → Login/Signup

  if (user.role === "admin") return <AdminTabs />;

  return <AppTabs />;
}