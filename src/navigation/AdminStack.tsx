import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminDashboard from '../screen/admin/AdminDashBoard';
import ManageUsers from '../screen/admin/UserManagement';
import ManageCategories from '../screen/admin/CategoriesManagement';
import ManageProducts from '../screen/admin/ProductsManagement';

export type AdminStackParamList = {
  AdminDashboard: undefined;
  ManageUsers: undefined;
  ManageCategories: undefined;
  ManageProducts: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    <Stack.Screen name="ManageUsers" component={ManageUsers} />
    <Stack.Screen name="ManageCategories" component={ManageCategories} />
    <Stack.Screen name="ManageProducts" component={ManageProducts} />
  </Stack.Navigator>
);

export default AdminStack;