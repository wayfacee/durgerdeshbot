import { useTelegram } from "@/shared/lib/hooks/useTelegram";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type {
  ProductToAdd,
} from "../../model/types/productSchema";
import cl from "./ProductForm.module.scss";
import { ProductFormItem } from "../ProductFormItem/ProductFormItem";

const getTotalPrice = (items: ProductToAdd[] = []): number => {
  return items.reduce((acc, item) => {
    const price = parseFloat(item.product.price.replace("$", "")); // Преобразуем строку в число
    return acc + (isNaN(price) ? 0 : price * item.quantity); // Добавляем цену, если она корректна
  }, 0);
};

export const ProductForm = () => {
  const location = useLocation();
  const { products: rawProducts } = location.state || { products: [] };
  const products = useMemo<ProductToAdd[]>(() => rawProducts, [rawProducts]);
  const [comment, setComment] = useState("");
  const { tg } = useTelegram();

  const [error] = useState("");
  // const { user } = useTelegram();

  // const onSendData = useCallback(async () => {
  //   if (!user?.username) {
  //     setError(
  //       "To place an order, you must have a username (example: @wildesh)",
  //     );
  //     return;
  //   }

  //   const data: OrderProduct = {
  //     user: user?.username,
  //     products: products,
  //     totalPrice: getTotalPrice(products),
  //   };

  //   try {
  //     await axios.post("http://localhost:5000/orders", data);
  //   } catch (e) {
  //     console.error("Error sending data:", e);
  //   }
  // }, [products, user?.username]);

  const onShowAlert = useCallback(() => {
    tg.showAlert("This is a test bot, you cannot order products!");
  }, [tg]);

  if (products.length === 0) {
    tg.MainButton.hide();
  } else {
    tg.MainButton.show();
    tg.MainButton.setParams({
      text: `PAY $${getTotalPrice(products).toFixed(2)}`,
      color: "#31b545",
    });
  }

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onShowAlert);

    return () => {
      tg.offEvent("mainButtonClicked", onShowAlert);
    };
  }, [onShowAlert, tg]);

  return (
    <div className={cl.container}>
      <div className={cl.header}>
        <h5>YOUR ORDER</h5>
        <Link to="/" className={cl.edit}>
          Edit
        </Link>
      </div>

      <div className={cl.products}>
        {products.map(({ product, productId, quantity }) => (
          <ProductFormItem
            product={product}
            productId={productId}
            quantity={quantity}
            key={product.id}
          />
        ))}
      </div>

      <div className={cl.back} />

      <input
        type="text"
        placeholder="Add comment..."
        value={comment}
        className={cl.input}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className={cl.back} />

      {error && <p>{error}</p>}
    </div>
  );
};
