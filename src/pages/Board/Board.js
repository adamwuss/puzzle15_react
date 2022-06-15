import styles from "./Board.module.css"
import { useEffect, useState } from "react";

const SOLUTION = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

export default function Board() {
  const [actualConfiguration, setActualConfiguration] = useState(SOLUTION);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState('00:00:00.000');
  const [running, setRunning] = useState(false);
  const [timeBegan, setTimeBegan] = useState(null);
  const [started, setStarted] = useState(null);

  const randomNumber = (array) => {
    const copyArray = JSON.parse(JSON.stringify(array));
    let currentIndex = 1000;

    while (currentIndex !== 0) {
      const indexZero = copyArray.indexOf(0);
      const availableIndexes = [...findAvailableIndexes(indexZero)];
      const randomIndex = Math.floor(Math.random() * availableIndexes.length);
      const indexAvailable = availableIndexes[randomIndex];

      [copyArray[indexZero], copyArray[indexAvailable]] = [copyArray[indexAvailable], copyArray[indexZero]];

      currentIndex--;
    }

    return copyArray;
  }

  const findAvailableIndexes = (indexZero) => {
    if (indexZero === 0) {
      return [indexZero + 1, indexZero + 4];
    }
    if (indexZero === 3) {
      return [indexZero - 1, indexZero + 4];
    }
    if (indexZero === 12) {
      return [indexZero + 1, indexZero - 4];
    }
    if (indexZero === 15) {
      return [indexZero - 1, indexZero - 4];
    }
    if (indexZero < 3) {
      return [indexZero - 1, indexZero + 1, indexZero + 4];
    }
    if (indexZero > 12) {
      return [indexZero - 1, indexZero + 1, indexZero - 4];
    }
    if ([7, 11].includes(indexZero)) {
      return [indexZero - 1, indexZero - 4, indexZero + 4];
    }
    if ([4, 8].includes(indexZero)) {
      return [indexZero + 1, indexZero - 4, indexZero + 4];
    }
    return [indexZero + 1, indexZero - 1, indexZero - 4, indexZero + 4];
  }

  const zeroPrefix = (num, digit) => {
    let zero = '';
    for (let i = 0; i < digit; i++) {
      zero += '0';
    }
    return (zero + num).slice(-digit);
  }

  const tileNextToEmpty = (tile) => {
    const indexTile = actualConfiguration.indexOf(tile);
    const indexZero = actualConfiguration.indexOf(0);

    if (indexTile === (indexZero - 1) && ![0, 4, 8, 12].includes(indexZero)) {
      return true;
    } else if (indexTile === (indexZero + 1) && ![3, 7, 11, 15].includes(indexZero)) {
      return true;
    } else if (indexTile === (indexZero - 4)) {
      return true;
    } else if (indexTile === (indexZero + 4)) {
      return true;
    }
    return false;
  }

  const moveTile = (tile) => {
    const indexTile = actualConfiguration.indexOf(tile);
    const indexEmpty = actualConfiguration.indexOf(0);

    if (tileNextToEmpty(tile)) {
      setMoves(moves + 1);

      const updateActualConfiguration = [...actualConfiguration];
      updateActualConfiguration[indexTile] = 0;
      updateActualConfiguration[indexEmpty] = tile;

      setActualConfiguration(updateActualConfiguration);

      if (JSON.stringify(actualConfiguration) === JSON.stringify(SOLUTION)) {
        stop();
        alert('Congratulation! You solve the puzzle!');
      }
    }
  }

  const shuffle = () => {
    setActualConfiguration(randomNumber(actualConfiguration));
    reset();
    start();
    setMoves(0);
  }

  const start = () => {
    if (running) return;

    if (timeBegan === null) {
      setTimeBegan(new Date());
    }

    setStarted(setInterval(clockRunning, 10));
    setRunning(true);
  }

  const stop = () =>  {
    setRunning(false);
    clearInterval(started);
  }

  const reset = () =>  {
    setRunning(false);
    clearInterval(started);
    setTimeBegan(null);
    setTime('00:00:00.000');
  }

  const clockRunning = () => {
    const currentTime = new Date();
    const timeElapsed = new Date(currentTime - timeBegan);
    const hour = timeElapsed.getUTCHours();
    const min = timeElapsed.getUTCMinutes();
    const sec = timeElapsed.getUTCSeconds();
    const ms = timeElapsed.getUTCMilliseconds();

    setTime(zeroPrefix(hour, 2) + ":" + zeroPrefix(min, 2) + ":" + zeroPrefix(sec, 2) + "." + zeroPrefix(ms, 3));
  }

  useEffect(() => {
    setActualConfiguration(randomNumber(SOLUTION));
    console.log('update');
  }, []);


  return (
    <div>
      <div className={styles.board}>
        {
          actualConfiguration.map((tile, index) => (
              <div
                className={`
                ${styles.tile}
                ${!tile && styles.empty}
                ${tileNextToEmpty(tile) && styles.cursorPointer}
                ${index + 1 === tile && styles.greyBackground}
                d-inline-flex align-items-center justify-content-center
              `}
                key={index}
                onClick={() => moveTile(tile)}
              >
                {tile}
              </div>
            )
          )
        }
      </div>
      <div className="mt-3">
        <div
          className="d-flex justify-content-between"
          style={{marginLeft: '5px'}}
        >
          <div>
            <button
              className="btn btn-primary me-2"
              onClick={() => shuffle()}
            >
              New game
            </button>
          </div>
          <div
            className="d-flex align-items-center"
            style={{fontSize: '25px'}}
          >
            Moves: {moves}
          </div>
          <div
            className="d-inline-flex align-items-center"
            style={{marginRight: '5px', fontSize: '25px'}}
          >
            {time}
          </div>
        </div>
      </div>
    </div>
  )
}