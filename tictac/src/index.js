import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  async handleClick(i) {
    const squares = this.getCurrentBoard();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // const current = history[history.length - 1];
    
    let all_history = history.concat([{
      squares: squares
    }])
    if(all_history.length === 3) {
      all_history.shift();
    }

    await this.setState({
      history: all_history,
      stepNumber : all_history.length -1,
      xIsNext: !this.state.xIsNext,
    });
    this.cpuAction(squares);
  }


  // 盤面取得
  getCurrentBoard(){
    const history = this.state.history.slice(0, this.state.stepNumber +1);
    const current = history[history.length -1];
    const squares = current.squares.slice();

    return squares;

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }


  cpuAction(squares) {
    if(this.calculateWinner(squares)) return;
    let history = this.state.history.slice(0, this.state.stepNumber +1);

    //空いているマスを取得
    const posisbleHand = [];
    let hand = squares.indexOf(null);
    while (hand !== -1){
      posisbleHand.push(hand);
      hand = squares.indexOf(null, hand +1);
    }

    // 空いているマスがなければ終了
    if(posisbleHand.length === 0) return;
    // 空いているマスのうちランダムで1マスを取得
    const actionHand = posisbleHand[Math.floor(Math.random()*posisbleHand.length)];
    // 選択した手で更新
    squares[actionHand] = this.state.xIsNext ? 'X' : 'O';
    history[history.length -1].squares = squares;

    this.setState({
      history,
      xIsNext: !this.state.xIsNext,
    });

  }

  
　calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


  render() {
    const history = this.state.history;
    const current = history[history.length -1];
    const winner = this.calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
      const moves = history.length < 2 ? null :(
      <button onClick={() => this.jumpTo(0)}>１回前へ戻る</button>
    );

    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/* {<ol>todo</ol> } */}
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);




