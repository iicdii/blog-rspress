import { ComponentProps } from "react";

export const Hr = (props: ComponentProps<"hr">) => {
  return (
    <hr
      {...props}
      className="my-6 border-t bordder-solid border-divider-light"
    />
  );
};
