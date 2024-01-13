import { ComponentProps } from "react";
import styles from "./index.module.scss";

export const Blockquote = (props: ComponentProps<"blockquote">) => {
  return (
    <blockquote
      {...props}
      className={`border-l-2 border-solid border-divider pl-4 my-6 transition-colors duration-500 ${styles.blockquote} ${props.className}`}
    />
  );
};
