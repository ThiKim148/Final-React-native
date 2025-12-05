import { ImageSourcePropType } from "react-native";
import { NavigatorScreenParams } from "@react-navigation/native"; // ✅ thêm import

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity?: number;
  categoryId: number;
  categoryName?: string;
};

export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

export type CartContextType = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  checkout: () => void; // thêm dòng này
};

export type HomeStackParamList = {
  Home: undefined;
  // Products: undefined;
  Category: undefined;
  Details: { product: Product };
  ProductsByCategory: { categoryId: number; categoryName: string };
  DetailProductStack: undefined;
  Cart: undefined;
  OrderHistory: undefined;
  AdminDashboard: undefined;
};

export type BottomTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>; // ✅ sửa từ undefined → NavigatorScreenParams
  Products: undefined;
  SignupSqlite: undefined;
  LoginSqlite: undefined;
};