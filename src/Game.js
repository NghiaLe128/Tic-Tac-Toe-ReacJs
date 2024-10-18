import React from 'react';
import Board from './components/Board';
import { calculateWinner, getLocation } from './helpers';

const initialState = {
  history: [
    {
      squares: Array(9).fill(null),
    },
  ],
  currentStepNumber: 0,
  xIsNext: true,
  isReversed: false, 
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.currentStepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares,
          currentLocation: getLocation(i),
          stepNumber: history.length,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      currentStepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      currentStepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  sortMoves() {
    this.setState(prevState => ({
      isReversed: !prevState.isReversed, 
    }));
  }

  reset() {
    this.setState(initialState);
  }

  render() {
    const { history, currentStepNumber, isReversed } = this.state;
    const current = history[currentStepNumber];
    const { winner, winnerRow } = calculateWinner(current.squares);

    const moves = (isReversed ? history.slice().reverse() : history).map((step, moveIndex) => {
      const actualMove = isReversed ? history.length - 1 - moveIndex : moveIndex; 
      const currentLocation = step.currentLocation ? `(${step.currentLocation})` : '';
      const desc = step.stepNumber ? `Go to move #${step.stepNumber}` : 'Go to game start';
      const classButton = actualMove === currentStepNumber ? 'button--green' : '';

      if (actualMove === currentStepNumber) {
        return (
          <li key={moveIndex}>
            <span className="button--current-move">You are at move #{actualMove} {currentLocation}</span>
          </li>
        );
      }

      return (
        <li key={moveIndex}>
          <button className={`${classButton} button`} onClick={() => this.jumpTo(actualMove)}>
            {`${desc} ${currentLocation}`}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner ${winner}`;
    } else if (history.length === 10) {
      status = 'Draw. No one won.';
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerSquares={winnerRow}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="button" onClick={() => this.sortMoves()}>Sort moves</button>
          <button className="button button--new-game" onClick={() => this.reset()}>New game</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;
