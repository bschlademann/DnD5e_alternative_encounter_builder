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
        style={{ backgroundImage: `url("/png/${upperLeftCorner}.png")` }}
      ></div>
      <div
        className="upper right corner"
        style={{ backgroundImage: `url("/png/${upperRightCorner}.png")` }}
      ></div>
      <div
        className="lower left corner"
        style={{ backgroundImage: `url("/png/${lowerLeftCorner}.png")` }}
      ></div>
      <div
        className="lower right corner"
        style={{ backgroundImage: `url("/png/${lowerRightCorner}.png")` }}
      ></div>
      <div
        className="upper edge"
        style={{ backgroundImage: `url("/png/${upperEdge}.png")` }}
      ></div>
      <div
        className="lower edge"
        style={{ backgroundImage: `url("/png/${lowerEdge}.png")` }}
      ></div>
      <div
        className="left edge"
        style={{ backgroundImage: `url("/png/${leftEdge}.png")` }}
      ></div>
      <div
        className="right edge"
        style={{ backgroundImage: `url("/png/${rightEdge}.png")` }}
      ></div>
      {children}
    </div>
  );
};
