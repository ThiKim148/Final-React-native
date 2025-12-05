import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Products from '../screen/HomeScreen';
import DetailsProducts from '../screen/DetailsProducts';
import ProductsByCategoryScreen from '../screen/ProductsByCategories';
import CartScreen from '../screen/CartScreen';
import OrderHisoryScreen from '../screen/OrderHistoryScreen';
import { HomeStackParamList, BottomTabParamList } from './types';
import CategoryScreen from '../screen/CategotyScreen';


const ProductStack = createNativeStackNavigator<HomeStackParamList>();

import AdminDashboard from '../screen/admin/AdminDashBoard';

export const DetailProductStack = () => (
  <ProductStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#fff' },
    }}
  >
    <ProductStack.Screen
      name="Home"
      component={Products}
      options={{ title: 'Trang chủ' }}
    />
    <ProductStack.Screen
      name="Details"
      component={DetailsProducts}
      options={{ title: 'Chi Tiết Sản Phẩm' }}
    />
    <ProductStack.Screen
      name="ProductsByCategory"
      component={ProductsByCategoryScreen}
      options={{ title: 'Danh mục sản phẩm' }}
    />
    <ProductStack.Screen
      name="Cart"
      component={CartScreen}
      options={{ title: 'Giỏ hàng' }}
    />
    <ProductStack.Screen
      name="OrderHistory"
      component={OrderHisoryScreen}
      options={{ title: 'Lịch sử đơn hàng' }}
    />

    <ProductStack.Screen
      name="Category"
      component={CategoryScreen}
      options={{ title: 'Danh mục' }}
    />
  </ProductStack.Navigator>
);

