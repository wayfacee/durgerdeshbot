import { ProductToAdd } from "../../model/types/productSchema";
import cl from "./ProductFormItem.module.scss";

const getProductTotalPrice = (product: ProductToAdd): number => {
  const price = parseFloat(product.product.price.replace("$", ""));
  return isNaN(price) ? 0 : price * product.quantity; 
};

export const ProductFormItem = (product: ProductToAdd) => {
  const {
    product: { description, img, title },
    quantity,
  } = product;

  return (
    <div className={cl.container}>
      <div className={cl.left}>
        <img className={cl.img} src={img} alt={title} />

        <div className={cl.titles}>
          <h5 className={cl.title}>
            {title} <span className={cl.span}>{quantity}x</span>
          </h5>

          <p className={cl.desc}>{description}</p>
        </div>
      </div>

      <p className={cl.price}>{`$${getProductTotalPrice(product)}`}</p>
    </div>
  );
};
