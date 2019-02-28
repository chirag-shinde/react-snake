import React from "react";

const GridCell = ({ isFood, isSnake }) => {
  const classes = `grid-cell ${isFood ? "food" : ""} ${isSnake ? "snake" : ""}`;

  return <div className={classes} />;
};

export default GridCell;
