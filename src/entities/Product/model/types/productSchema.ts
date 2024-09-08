export interface ProductFromDB {
  id: number;
  img: string;
  price: string;
  title: string;
  description: string;
  buttonTitle: string;
}

export interface ProductToAdd {
  productId: number;
  product: ProductFromDB;
  quantity: number;
}

export interface OrderProduct {
  user: string;
  products: ProductToAdd[];
  totalPrice: number;
}