import cl from "./Skeleton.module.scss";
import { CSSProperties, memo } from "react";

interface SkeletonProps {
  height?: string | number;
  width?: string | number;
  border?: string;
}

export const Skeleton = memo((props: SkeletonProps) => {
  const { border, height, width } = props;

  const styles: CSSProperties = {
    width,
    height,
    borderRadius: border,
  };

  return <div className={cl.Skeleton} style={styles} />;
});
