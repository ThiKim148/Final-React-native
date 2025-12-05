import React, { useEffect, useState } from "react";
import {
    FlatList,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";

import { HomeStackParamList } from "../navigation/types";
import { Category, Product } from "../navigation/types";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "./AppNavigatorProduct";
import {
    fetchCategories,
    fetchProductsByCategory,
} from "../database/data";
import CategorySelector from "./CategorySelector";
import { productImages } from '../utils/ImageMap';

// Định nghĩa kiểu navigation cho stack
type NavigationProp = NativeStackNavigationProp<
    HomeStackParamList,
    "ProductsByCategory"
>;
type RouteProps = RouteProp<HomeStackParamList, "ProductsByCategory"> & {
    goBack: () => void;
};

export default function ProductsByCategoryScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();

    // Lấy categoryId và categoryName từ params
    const { categoryId, categoryName } = route.params;

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);

    useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);

    useEffect(() => {
        fetchProductsByCategory(selectedCategoryId).then(setProducts);
    }, [selectedCategoryId]);

    const getImageSource = (image?: string) => {
        if (image && image.startsWith("file://")) return { uri: image };
        switch (image) {
            case "bomber.jacket.jpg":
                return require("../assets/products_images/bomber_jacket.jpg");
            default:
                return require("../assets/products_images/bomber_jacket.jpg");
        }
    };

    return (
        <View style={{ flex: 1, padding: 10 }}>
            {/* Nút quay lại */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>← Quay lại</Text>
            </TouchableOpacity>

            <CategorySelector
                categories={categories}
                selectedId={selectedCategoryId}
                onSelect={(id) => setSelectedCategoryId(id)}
            />
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("Details", { product: item })}
                    >
                    <Image
                        source={productImages[item.image] || getImageSource(item.image)}
                        style={styles.image}
                    />
                    <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text>{item.price.toLocaleString()} đ</Text>
                    </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        marginBottom: 20,
        width: "25%",
        marginRight: '50%',
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: '#E91E63',
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    card: {
        flexDirection: "row",
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 10,
    },
    info: {
        justifyContent: "center",
    },
    name: {
        fontWeight: "bold",
    },
});