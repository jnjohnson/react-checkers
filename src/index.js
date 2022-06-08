import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';

class Piece extends React.Component {
    isKing = false;

    render() {
        if (this.props.team === 'red') {
            return (
                <div className="piece red"></div>
            )
        } else {
            return (
                <div className="piece black"></div>
            )
        }
    }
}

class Square extends React.Component {
    render() {
        var piece = '';
        if (this.props.hasPiece && this.props.row < 3) {
            piece = <Piece team="red" />
        } else if (this.props.hasPiece && this.props.row > 4){
            piece = <Piece team="black" />
        }
        return (
            <button className="square">{piece}</button>
        );
    }
}
  
class Board extends React.Component {
    renderSquare(i, j, hasPiece) {
        const key = i.toString() + j.toString();
        return <Square key={key} row={i} column={j} hasPiece={hasPiece} />;
    }
  
    render() {
        var board = Array(8).fill(Array(8));
        for (var i=0; i<8; i++) {
            for (var j=0; j<8; j++) {
                if (i < 3 || i > 4) {
                    if ((i%2 === 0 && j%2 === 1) || (i%2 === 1 && j%2 === 0)) {
                        board[i][j] = this.renderSquare(i, j, true);
                    } else {
                        board[i][j] = this.renderSquare(i, j, false);

                    }
                } else {
                    board[i][j] = this.renderSquare(i, j, false);
                }
            }
        }
        return (
        <div>
            <div className="column-num">
            {board.map((row, index) => (
                <div>{index}</div>
            ))}
            </div>
            {board.map((row, index) => (
                <div className="row">
                    <div className="row-num">{index}</div>
                    {row}
                </div>
            ))}
        </div>
        );
    }
}
  
class Game extends React.Component {
    render() {
        const status = 'Next player: X';
        return (
            <div className="game">
                <div className="status">{status}</div>
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  