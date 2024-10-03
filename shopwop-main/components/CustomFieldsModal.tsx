import React from "react";
import Modal from "@/components/Modal";
import { Product } from "@/types";

interface CustomFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  customFields: Record<string, string>;
  errors: Record<string, string>;
  onCustomFieldChange: (name: string, value: string) => void;
  onConfirm: () => void;
}

const CustomFieldsModal: React.FC<CustomFieldsModalProps> = ({
  isOpen,
  onClose,
  product,
  customFields,
  errors,
  onCustomFieldChange,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customize Your Purchase">
      {product.custom_fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block text-sm font-medium text-text">
            {field.name}
          </label>
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={customFields[field.name] || ""}
            onChange={(e) => onCustomFieldChange(field.name, e.target.value)}
            className="mt-1 w-full p-3 border border-primary bg-transparent text-text placeholder:text-text focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50 rounded-lg"
            required={field.required}
          />
          {errors[field.name] && (
            <span className="text-red-500 text-sm">{errors[field.name]}</span>
          )}
        </div>
      ))}
      <button
        className="btn w-full bg-primary hover:bg-hover text-text py-2 rounded-lg"
        onClick={onConfirm}
      >
        Confirm Purchase
      </button>
    </Modal>
  );
};

export default CustomFieldsModal;
