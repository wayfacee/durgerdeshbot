import { ProductFromDB } from "../../model/types/productSchema";
import axios from "axios";
import { ProductItem } from "../ProductItem/ProductItem";
import { useEffect, useState } from "react";
import cl from "./ProductList.module.scss";
import { Skeleton } from "@/shared/ui/Skeleton";

export const ProductList = () => {
  const [products, setProducts] = useState<ProductFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState<string | null>(null);

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
      {products.map(({ id, buttonTitle, img, price, title }) => (
        <ProductItem
          key={id}
          id={id}
          buttonTitle={buttonTitle}
          img={img}
          price={price}
          title={title}
        />
      ))}
    </div>
  );
};
