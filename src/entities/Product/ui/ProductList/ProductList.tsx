import {
  OrderProduct,
  ProductFromDB,
  ProductToAdd,
} from "../../model/types/productSchema";
import axios from "axios";
import { ProductItem } from "../ProductItem/ProductItem";
import { useCallback, useEffect, useState } from "react";
import cl from "./ProductList.module.scss";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useTelegram } from "@/shared/lib/hooks/useTelegram";

const getTotalPrice = (items: ProductToAdd[] = []): number => {
  return items.reduce((acc, item) => {
    const price = parseFloat(item.product.price.replace('$', '')); // Преобразуем строку в число
    return acc + (isNaN(price) ? 0 : price * item.quantity); // Добавляем цену, если она корректна
  }, 0);
};

export const ProductList = () => {
  const [products, setProducts] = useState<ProductFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tg, user } = useTelegram();
  const [addedProducts, setAddedProducts] = useState<ProductToAdd[]>([]);
  const [count, setCount] = useState<{ [key: number]: number }>({});

  const updateAddedProducts = useCallback(() => {
    const newAddedProducts: ProductToAdd[] = products
      .filter((product) => count[product.id] > 0)
      .map((product) => ({
        productId: product.id,
        product,
        quantity: count[product.id],
      }));
    setAddedProducts(newAddedProducts);

    if (newAddedProducts.length === 0) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: `Купить $${getTotalPrice(newAddedProducts).toFixed(2)}`,
      });
    }
  }, [count, products, tg.MainButton]);

  const onPlus = useCallback((id: number) => {
    setCount((prevCount) => ({
      ...prevCount,
      [id]: (prevCount[id] || 0) + 1,
    }));
  }, []);

  const onMinus = useCallback((id: number) => {
    setCount((prevCount) => ({
      ...prevCount,
      [id]: Math.max((prevCount[id] || 0) - 1, 0),
    }));
  }, []);

  const onSendData = useCallback(async () => {
    if (!user?.username) {
      setError(
        "To place an order, you must have a username (example: @wildesh)",
      );
      return;
    }

    const data: OrderProduct = {
      user: user?.username,
      products: addedProducts,
      totalPrice: getTotalPrice(addedProducts),
    };

    try {
      await axios.post("http://localhost:5000/orders", data);
    } catch (e) {
      console.error("Error sending data:", e);
    }
  }, [addedProducts, user?.username]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductFromDB[]>(
          "http://localhost:5000/card",
        );
        setProducts(response.data);
      } catch {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    updateAddedProducts();
  }, [updateAddedProducts, products]);

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);

    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [onSendData, tg]);

  if (loading) {
    return (
      <div className="container">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} width={100} height={120} />
        ))}
      </div>
    );
  }

  return (
    <div className={cl.container}>
      {products.map((product) => (
        <ProductItem
          key={product.id}
          count={count[product.id] || 0}
          onMinus={() => onMinus(product.id)}
          onPlus={() => onPlus(product.id)}
          product={product}
        />
      ))}

      {error && <h5 className="text-red-500">{error}</h5>}
    </div>
  );
};
