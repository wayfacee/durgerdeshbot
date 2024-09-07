import { Button } from "@/shared/ui/Button/Button";
import { ProductFromDB } from "../../model/types/productSchema";
import cl from "./ProductItem.module.scss";
import { memo, useCallback, useEffect, useState } from "react";

export const ProductItem = memo((product: ProductFromDB) => {
  const { buttonTitle, img, price, title } = product;
  const [count, setCount] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);

  const onPlus = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
    setAnimateKey((prevKey) => prevKey + 1);
  }, []);

  const onMinus = useCallback(() => {
    setCount((prevCount) => Math.max(prevCount - 1, 0));
  }, []);

  useEffect(() => {
    if (count > 0) {
      // Когда count больше нуля, инициируйте анимацию
      setAnimateKey((prevKey) => prevKey + 1);
    }
  }, [count]);

  return (
    <div className={cl.product}>
      <img className={cl.img} src={img} alt={title} />
      <p className={cl.title}>
        {title} · <span className={cl.span}>{price}</span>
      </p>
      <Button
        moreThanOne={count > 0}
        onPlus={onPlus}
        onMinus={onMinus}
        title={buttonTitle}
      />

      {count > 0 && (
        <div key={animateKey} className={cl.circle}>
          {count}
        </div>
      )}
    </div>
  );
});
