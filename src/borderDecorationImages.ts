export type BorderDecorationImages = {
  upperLeftCorner: string;
  upperRightCorner: string;
  lowerLeftCorner: string;
  lowerRightCorner: string;
  upperEdge: string;
  lowerEdge: string;
  leftEdge: string;
  rightEdge: string;
};


export type BorderDecorationsByComponent = {
  [component: string]: BorderDecorationImages;
};

export const borderDecorationsByComponent: BorderDecorationsByComponent = {
  border_1: {
    upperLeftCorner: "corner_1",
    upperRightCorner: "corner_1",
    lowerLeftCorner: "corner_1",
    lowerRightCorner: "corner_1",
    upperEdge: "border_1_top-bottom",
    lowerEdge: "border_1_top-bottom",
    leftEdge: "border_1_side",
    rightEdge: "border_1_side",
  },
};
