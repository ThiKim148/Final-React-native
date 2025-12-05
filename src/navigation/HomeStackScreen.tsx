import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screen/HomeScreen';
import DetailsProducts from '../screen/DetailsProducts';
import ProductsByCategoryScreen from '../screen/ProductsByCategories';
import CartScreen from '../screen/CartScreen';
import OrderHisoryScreen from '../screen/OrderHistoryScreen';
import CategoryScreen from '../screen/CategotyScreen';
import AdminDashboard from '../screen/admin/AdminDashBoard';
import { HomeStackParamList } from './types';


const Stack = createNativeStackNavigator<HomeStackParamList>();


const HomeStackScreen = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Details"component={DetailsProducts} />
            <Stack.Screen name="ProductsByCategory" component={ProductsByCategoryScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHisoryScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="Category" component={CategoryScreen}/>
        </Stack.Navigator>
    );
};


export default HomeStackScreen;