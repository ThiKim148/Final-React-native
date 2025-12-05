import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import AdminDashboard from "../screen/admin/AdminDashBoard";
import AdminStack from "./AdminStack";
import LogoutScreen from "../screen/Logout";

const Tab = createBottomTabNavigator();

const AdminTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
        name="Admin" // tên tab là "Admin"
        component={AdminStack}
        options={{
            title: "Admin",
            tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>⚙️</Text>
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

export default AdminTabs;