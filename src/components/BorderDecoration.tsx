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

  const assetUrl = `${import.meta.env.BASE_URL}png`;

  return (
    <div className="container">
      <div
        className="upper left corner"
        style={{ backgroundImage: `url(${assetUrl}/${upperLeftCorner}.png)` }}
      ></div>
      <div
        className="upper right corner"
        style={{ backgroundImage: `url(${assetUrl}/${upperRightCorner}.png)` }}
      ></div>
      <div
        className="lower left corner"
        style={{ backgroundImage: `url(${assetUrl}/${lowerLeftCorner}.png)` }}
      ></div>
      <div
        className="lower right corner"
        style={{ backgroundImage: `url(${assetUrl}/${lowerRightCorner}.png)` }}
      ></div>
      <div
        className="upper edge"
        style={{ backgroundImage: `url(${assetUrl}/${upperEdge}.png)` }}
      ></div>
      <div
        className="lower edge"
        style={{ backgroundImage: `url(${assetUrl}/${lowerEdge}.png)` }}
      ></div>
      <div
        className="left edge"
        style={{ backgroundImage: `url(${assetUrl}/${leftEdge}.png)` }}
      ></div>
      <div
        className="right edge"
        style={{ backgroundImage: `url(${assetUrl}/${rightEdge}.png)` }}
      ></div>
      {children}
    </div>
  );
};
