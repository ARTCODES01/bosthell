"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import CustomFieldsModal from "./CustomFieldsModal";
import DeliveryModal from "./DeliveryModal";
import { Product } from "@/types";
import Modal from "./Modal";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ProductsListProps {
	products: Product[];
}

// Your Sellix API Key
const API_KEY = process.env.NEXT_PUBLIC_SELLIX_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_SELLIX_API_URL;

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [buyProduct, setBuyProduct] = useState<Product | null>(null);
	const [customFields, setCustomFields] = useState<Record<string, string>>({});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [deliveryEmail, setDeliveryEmail] = useState("");
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [showDeliveryModal, setShowDeliveryModal] = useState(false);
	const [showCustomFieldsModal, setShowCustomFieldsModal] = useState(false);

	const router = useRouter();

	const handleDescriptionClick = (product: Product) => {
		setSelectedProduct(product);
	};

	const handleCustomFieldChange = (name: string, value: string) => {
		setCustomFields((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when field is changed
	};

	const handleCloseModal = () => {
		setSelectedProduct(null);
	};

	const handleBuyClick = (product: Product) => {
		if (product.custom_fields && product.custom_fields.length > 0) {
			setBuyProduct(product);
			const initialFields: Record<string, string> = {};
			product.custom_fields.forEach((field) => {
				initialFields[field.name] = "";
			});
			setCustomFields(initialFields);
			setErrors({});
			setShowCustomFieldsModal(true); // Show the custom fields modal
		} else {
			setBuyProduct(product);
			setShowDeliveryModal(true); // Show the delivery modal directly
		}
	};

	const handleCloseCustomFieldsModal = () => {
		setShowCustomFieldsModal(false);
		setBuyProduct(null); // Clear buyProduct when closing the custom fields modal
	};

	const validateFields = () => {
		const newErrors: Record<string, string> = {};
		buyProduct?.custom_fields.forEach((field) => {
			if (field.required && !customFields[field.name]) {
				newErrors[field.name] = `${field.name} is required.`;
			} else if (
				field.regex &&
				!new RegExp(field.regex).test(customFields[field.name])
			) {
				newErrors[field.name] = `Invalid ${field.name}.`;
			}
		});
		return newErrors;
	};

	const handleConfirmPurchase = () => {
		const validationErrors = validateFields();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
		} else {
			setShowDeliveryModal(true); // Show delivery modal after validation
			setShowCustomFieldsModal(false); // Close custom fields modal
		}
	};

	const handleDeliveryConfirm = async () => {
		if (!deliveryEmail) {
			alert("Email is required.");
			return false;
		}
		if (!termsAccepted) {
			alert("You must accept the terms of service.");
			return false;
		}

		console.log("Finalizing purchase for:", buyProduct);
		console.log("Custom Fields:", customFields);
		console.log("Delivery Email:", deliveryEmail);
		const { data } = await axios.post(
			`${API_URL}/payments`,
			{
				product_id: buyProduct?.id, // Product ID
				title: buyProduct?.name, // Product name
				currency: buyProduct?.currency, // Product currency
				value: buyProduct?.price, // Product price
				email: deliveryEmail, // Pass the customer's email
				custom_fields: customFields, // Custom fields data
				return_url: "https://vouch.saint.bet",
			},
			{
				headers: {
					Authorization: `Bearer ${API_KEY}`, // Replace API_KEY with your actual API key
					"Content-Type": "application/json", // Set Content-Type
				},
			},
		);

		console.log("Payment Response:", data);

		if (data.error) {
			alert(data.error);
			return false;
		}

		// Redirect to the payment URL
		router.push(data.data.url);

		setBuyProduct(null);
		setShowDeliveryModal(false);
	};

	return (
		<>
			<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 w-full">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						onDescriptionClick={handleDescriptionClick}
						onBuyClick={handleBuyClick}
					/>
				))}
			</div>

			{selectedProduct && (
				<Modal
					isOpen={!!selectedProduct}
					onClose={handleCloseModal}
					title="Product Description"
				>
					<div className="prose text-text">
						<ReactMarkdown>{selectedProduct.description}</ReactMarkdown>
					</div>
				</Modal>
			)}

			{showCustomFieldsModal && buyProduct && (
				<CustomFieldsModal
					isOpen={showCustomFieldsModal}
					onClose={handleCloseCustomFieldsModal}
					product={buyProduct}
					customFields={customFields}
					errors={errors}
					onCustomFieldChange={handleCustomFieldChange}
					onConfirm={handleConfirmPurchase}
				/>
			)}

			{showDeliveryModal && (
				<DeliveryModal
					isOpen={showDeliveryModal}
					onClose={() => setShowDeliveryModal(false)}
					deliveryEmail={deliveryEmail}
					setDeliveryEmail={setDeliveryEmail}
					termsAccepted={termsAccepted}
					setTermsAccepted={setTermsAccepted}
					onConfirm={handleDeliveryConfirm}
				/>
			)}
		</>
	);
};

export default ProductsList;
