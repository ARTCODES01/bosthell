import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { Product } from "@/types";

interface ProductCardProps {
	product: Product;
	onDescriptionClick: (product: Product) => void;
	onBuyClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
	product,
	onDescriptionClick,
	onBuyClick,
}) => {
	const [stock, setStock] = useState<number | string>(product.stock);

	const fetchStock = async () => {
		try {
			const response = await fetch("/api/stock");
			const data = await response.json();

			if (product.id === "66eee30552502") {
				setStock(data.oneMonth * 2); // 1M product, double the tokens for boosts
			} else if (product.id === "66f1514ad8bfb") {
				setStock(data.threeMonths);
			}
		} catch (error) {
			console.error("Failed to fetch stock:", error);
			setStock("99+"); // Fallback in case of API error
		}
	};

	useEffect(() => {
		fetchStock();
	}, []);

	const isOutOfStock = typeof stock === "number" && stock <= 0;

	return (
		<div className="flex flex-col justify-between p-6 border border-primary rounded-lg bg-transparent shadow-md hover:shadow-lg transition duration-300 text-center h-full relative">
			<div className="p-2">
				<div
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-300 cursor-pointer"
					onClick={() => onDescriptionClick(product)}
				>
					<FiInfo size={25} />
				</div>

				<h3 className="text-xl font-semibold mb-2 text-text capitalize">
					{product.name}
				</h3>
				<p className="text-sm mb-2 text-text">
					<span className="font-semibold">Price:</span> {product.currency} $
					{product.price}
				</p>
				<p className="text-sm mb-4 text-text">
					<span className="font-semibold">Stock:</span>{" "}
					{stock === "99+"
						? "99+"
						: isOutOfStock
							? "Out of Stock"
							: `${stock} available`}
				</p>
			</div>

			<button
				className={`mt-2 btn ${
					isOutOfStock ? "btn-disabled" : "bg-primary hover:bg-hover text-text"
				}`}
				disabled={isOutOfStock}
				onClick={() => onBuyClick(product)}
			>
				{isOutOfStock ? "Out of Stock" : "Buy Now"}
			</button>
		</div>
	);
};

export default ProductCard;
