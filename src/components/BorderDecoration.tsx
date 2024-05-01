import { ReactNode } from "react";
import "./BorderDecoration.css";

type BorderDecorationProps = {
  children: ReactNode;
};

export const BorderDecoration = ({ children }: BorderDecorationProps) => {
  return (
    <div className="container">
      <div className="upper left corner"></div>
      <div className="upper right corner"></div>
      <div className="lower left corner"></div>
      <div className="lower right corner"></div>
      <div className="upper border"></div>
      <div className="lower border"></div>
      <div className="left border"></div>
      <div className="right border"></div>
      {children}
    </div>
  );
};
