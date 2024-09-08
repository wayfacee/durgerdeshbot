import { Button } from "@/shared/ui/Button/Button";
import { ProductFromDB } from "../../model/types/productSchema";
import cl from "./ProductItem.module.scss";
import { memo, useEffect, useState } from "react";

interface ProductItemProps {
  product: ProductFromDB;
  count: number;
  onPlus: (id: number) => void;
  onMinus: (id: number) => void;
}

export const ProductItem = memo((props: ProductItemProps) => {
  const {
    onMinus,
    onPlus,
    count,
    product: { id, buttonTitle, img, price, title },
  } = props;
  const [animateKey, setAnimateKey] = useState(0);

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
        onPlus={() => onPlus(id)}
        onMinus={() => onMinus(id)}
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
