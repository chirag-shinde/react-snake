import React, { useState, useEffect } from "react";
import GridCell from "./GridCell";
import { getOppositeDirection } from "../utility/helper";

const Grid = ({ gridSize }) => {
  const initialSnake = [{ x: 5, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 1 }];
  const initialDirection = 39;
  const initialFoodLocation = { x: 20, y: 15 };
  const [food, setFood] = useState(initialFoodLocation);
  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState(initialDirection);
  const [gameStatus, setGameStatus] = useState(0);
  const [score, setScore] = useState(0);

  const highscore = localStorage.getItem("highscore");
  //Handle GameState Effect
  useEffect(() => {
    if (gameStatus !== 1) return;
    var timerID = setInterval(() => moveSnake(), 100);
    return () => {
      clearInterval(timerID);
    };
  });

  // EventListener for keydown
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handleKeyDown = ({ keyCode }) => {
    //Pause snake
    if (keyCode === 32) {
      setGameStatus(Number(!gameStatus));
      return;
    }
    //Don't change direction if same or opposite
    if (keyCode === direction || keyCode === getOppositeDirection(direction))
      return;

    //Avoid change of Direction when paused
    if (gameStatus === 0) return;

    setDirection(keyCode);
  };

  //Check if cell contains snake
  const isSnake = (i, j) => {
    return snake.some(coordinates => {
      return coordinates.x === i && coordinates.y === j;
    });
  };
  //Construct the Grid
  const constructGrid = () => {
    const x = [...Array(gridSize).keys()];

    return x.map(j =>
      x.map(i => (
        <GridCell
          key={`${i}-${j}`}
          isFood={i === food.x && j === food.y}
          isSnake={isSnake(i, j)}
        />
      ))
    );
  };
  const collidedWithEdge = (x, y) => {
    if (x >= gridSize || x < 0 || y >= gridSize || y < 0) {
      return true;
    }
  };
  const createFood = () => {
    const [x, y] = [
      Math.floor(Math.random() * Math.floor(gridSize)),
      Math.floor(Math.random() * Math.floor(gridSize))
    ];
    if (isSnake(x, y)) {
      createFood();
    } else {
      setFood({ x, y });
    }
  };
  const resetGame = () => {
    setGameStatus(0);
    setSnake(initialSnake);
    setFood(initialFoodLocation);
    setDirection(initialDirection);
    if (score > highscore) {
      localStorage.setItem("highscore", score);
    }
    setScore(0);
  };
  const moveSnake = () => {
    console.log(snake.length);
    let newSnake = [...snake];
    const oldHead = { ...newSnake[0] };
    const newHead = { ...oldHead };
    if (direction === 39) {
      newHead.x = newHead.x + 1;
    }
    if (direction === 40) {
      newHead.y = newHead.y + 1;
    }
    if (direction === 37) {
      newHead.x = newHead.x - 1;
    }
    if (direction === 38) {
      newHead.y = newHead.y - 1;
    }
    newSnake.unshift(newHead);
    if (collidedWithEdge(newHead.x, newHead.y)) {
      resetGame();
      return;
    }

    if (newHead.x === food.x && newHead.y === food.y) {
      createFood();
      setScore(score + 1);
    } else {
      newSnake.pop();
    }
    if (isSnake(newHead.x, newHead.y) && snake.length > 4) {
      resetGame();
      return;
    }

    setSnake(newSnake);
  };
  return (
    <div className="grid">
      <div className="btn">
        <button
          onClick={() => {
            setGameStatus(1);
          }}
          disabled={gameStatus !== 0}
        >
          Start
        </button>
        <button
          onClick={() => {
            setGameStatus(0);
          }}
          disabled={gameStatus !== 1}
        >
          Pause
        </button>
        <span>Current Score: {score}</span>
        <span> HighScore: {highscore ? highscore : "-"}</span>
        <span>
          {highscore && score > highscore
            ? " You've beaten your high score!"
            : ""}
        </span>
      </div>
      {constructGrid()}
    </div>
  );
};

export default Grid;
