import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screen/HomeScreen";
import CategoryScreen from "../screen/CategotyScreen";
import ProductsByCategoryScreen from "../screen/ProductsByCategories";
import { HomeStackParamList } from "./types";
import DetailsScreen from "../screen/DetailsProducts";
import CartScreen from "../screen/CartScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function TopTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="ProductsByCategory" component={ProductsByCategoryScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}