import cl from "./Button.module.scss";

interface ButtonProps {
  title: string;
  onPlus: () => void;
  onMinus: () => void;
  moreThanOne?: boolean;
  green?: boolean;
}

export const Button = ({
  green,
  title,
  moreThanOne,
  onMinus,
  onPlus,
}: ButtonProps) => {
  if (green) {
    return <button className="bg-green-600">{title}</button>;
  }

  if (moreThanOne) {
    return (
      <div className={cl.btns}>
        <button onClick={onMinus} className={cl.minusBtn}>
          −
        </button>
        <button onClick={onPlus} className={cl.plusBtn}>
          +
        </button>
      </div>
    );
  }

  return (
    <button onClick={onPlus} className={cl.mainBtn}>
      {title}
    </button>
  );
};
