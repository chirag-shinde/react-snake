export const getOppositeDirection = key => {
  const oppositeDirections = {
    37: 39,
    39: 37,
    38: 40,
    40: 38
  };
  return oppositeDirections[key];
};
