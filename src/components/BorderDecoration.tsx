import { ReactNode } from "react";
import "./BorderDecoration.css";
import { BorderDecorationImages } from "../borderDecorationImages";

export type BorderDecorationProps = {
  children: ReactNode;
  borderStyles: BorderDecorationImages;
};

export const BorderDecoration = ({
  children,
  borderStyles,
}: BorderDecorationProps) => {
  const {
    upperLeftCorner,
    upperRightCorner,
    lowerLeftCorner,
    lowerRightCorner,
    upperEdge,
    lowerEdge,
    leftEdge,
    rightEdge,
  } = borderStyles;

  return (
    <div className="container">
      <div
        className="upper left corner"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}png/${upperLeftCorner}.png)` }}
      ></div>
      <div
        className="upper right corner"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}png/${upperRightCorner}.png)` }}
      ></div>
      <div
        className="lower left corner"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}png/${lowerLeftCorner}.png)` }}
      ></div>
      <div
        className="lower right corner"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}png/${lowerRightCorner}.png)` }}
      ></div>
      <div
        className="upper edge"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}png/${upperEdge}.png)` }}
      ></div>
      <div
        className="lower edge"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}png/${lowerEdge}.png)` }}
      ></div>
      <div
        className="left edge"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}png/${leftEdge}.png)` }}
      ></div>
      <div
        className="right edge"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}png/${rightEdge}.png)` }}
      ></div>
      {children}
    </div>
  );
};
