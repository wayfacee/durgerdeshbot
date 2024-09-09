import { ProductFromDB, ProductToAdd } from "../../model/types/productSchema";
import axios from "axios";
import { ProductItem } from "../ProductItem/ProductItem";
import { useCallback, useEffect, useState } from "react";
import cl from "./ProductList.module.scss";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useTelegram } from "@/shared/lib/hooks/useTelegram";
import { useNavigate } from "react-router-dom";

export const ProductList = () => {
  const [products, setProducts] = useState<ProductFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tg } = useTelegram();
  const [addedProducts, setAddedProducts] = useState<ProductToAdd[]>([]);
  const [count, setCount] = useState<{ [key: number]: number }>({});
  const navigate = useNavigate();

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
        text: "VIEW ORDER",
        color: "#31b545",
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

  const onMainButtonClick = useCallback(() => {
    if (addedProducts.length > 0) {
      navigate("/product-form", { state: { products: addedProducts } });
    } else {
      setError("Please add at least 1 product!");
    }
  }, [addedProducts, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductFromDB[]>(
          import.meta.env.VITE_APP_BD,
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
    tg.onEvent("mainButtonClicked", onMainButtonClick);

    return () => {
      tg.offEvent("mainButtonClicked", onMainButtonClick);
    };
  }, [onMainButtonClick, tg]);

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
