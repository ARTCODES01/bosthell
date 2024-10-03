import AsciiArt from "@/components/AsciiArt";
import ProductsList from "@/components/ProductsList";
import React from "react";
import DisableInspect from "../ctrl";
import axios from "axios";
import { Product } from "@/types";

// Your Sellix API Key
const API_KEY = process.env.NEXT_PUBLIC_SELLIX_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_SELLIX_API_URL;

const App: React.FC = async () => {
	const products: Product[] = await getProducts();

	return (
		<div className="min-h-screen flex flex-col xl:flex-row bg-background text-text relative">
			{/* Left side: Products */}
			<div className="flex-1 p-6 md:p-10 lg:p-12 overflow-auto">
				<ProductsList products={products} />
			</div>

			{/* Right side: ASCII Art */}
			<div className="flex-1 flex justify-center items-center p-6 md:p-10 lg:p-12">
				<AsciiArt />
			</div>
		</div>
	);
};

export default App;

async function getProducts() {
	try {
		const { data } = await axios.get(`${API_URL}/products`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		});

		console.log(
			data.data.products.map(
				(product: any) => product.title + " " + product.stock,
			),
		);
		const products = data.data.products.map((product: any) => {
			return {
				id: product.uniqid,
				shop_id: product.shop_id,
				currency: product.currency,
				name: product.title,
				description: product.description,
				price: product.price,
				stock: product.stock,
				custom_fields: product.custom_fields,
			};
		});

		return products;
	} catch (error) {
		console.error(error);
		return [];
	}
}
