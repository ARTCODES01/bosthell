interface CustomField {
  type: string;
  name: string;
  required: boolean;
  regex: string;
  placeholder: string;
}

export interface Product {
  id: string;
  shop_id: string;
  currency: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  custom_fields: CustomField[];
}
