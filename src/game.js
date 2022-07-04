import React from 'react';
import Board from './board.js';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            board: this.initBoard(),
            blackIsNext: true,
        }
    }

    // Get the board (for checking variables)
    getBoard() {
        return this.state.board;
    }

    // Get a copy of the board (for setting state)
    getBoardCopy() {
        return this.state.board.slice();
    }

    // Sets the state of board
    setBoard(board) {
        this.setState({
            board: board
        })
    }

    // Get a square on the board (for checking variables)
    getSquare(i, j) {
        return this.state.board[i][j];
    }

    // Get a copy of a square on the board (for setting state)
    getSquareCopy(i, j) {
        return this.state.board.slice()[i][j];
    }

    // Sets the state of a square on the board
    setSquare(i, j, square) {
        const board = this.getBoardCopy();
        board[i][j] = square;
        this.setBoard(board);
    }

    // Initializes the board
    initBoard() {
        const board = Array(this.props.rows).fill(null).map(row => new Array(this.props.columns).fill(null));
        for (var i=0; i<this.props.rows; i++) {
            for (var j=0; j<this.props.columns; j++) {
                board[i][j] = this.initSquare(i, j);
            }
        }
        return board;
    }

    // Initializes the data for a square on the board 
    initSquare(i, j) {
        const data = {
            clicked: false,
            canMoveTo: false,
            hasPiece: false,
            piece: {
                color: '',
                isKing: false,
            }
        }
        if ((i%2 === 1 && j%2 === 0) || (i%2 === 0 && j%2 === 1)) {
            if (i < 3) {
                data.hasPiece = true;
                data.piece.color = 'red';
            } else if (i > 4) {
                data.hasPiece = true;
                data.piece.color = 'black';
            }
        }
        return data;
    }

    // Handles what happens when a square is clicked
    // Resets the data.clicked and data.canMoveTo flags for each square
    // If the square has a piece on it, highlight the piece and it's available moves
    handleClick(i, j) {
        this.resetBoard();
        if (this.hasPiece(i, j)) {
            this.checkMoves(i, j);
            const square = this.getSquareCopy(i, j);
            square.clicked = true;
            this.setSquare(i, j, square);
        }
    }

    hasPiece(i, j) {
        return this.state.board[i][j].hasPiece;
    }
    // Checks to see what moves are available for a given piece
    checkMoves(i, j) {
        const square = this.getSquare(i, j);
        if (square.piece.isKing) {
            // TODO: Handle king logic
        } else {
            if (square.piece.color === 'red') {
                if (!this.hasPiece(i + 1, j + 1)) {

                }
                if (!this.hasPiece(i + 1, j - 1)) {

                }
            } else {
                if (!this.hasPiece(i - 1, j + 1)) {

                }
                if (!this.hasPiece(i - 1, j - 1)) {
                    
                }
            }
        }
    }

    // Sets data.clicked and data.canMoveTo to false for every square on the board
    resetBoard() {
        const board = this.getBoardCopy();
        for (var i=0; i<this.props.rows; i++) {
            for (var j=0; j<this.props.columns; j++) {
                board[i][j].clicked = false;
                board[i][j].canMoveTo = false;
            }
        }
        this.setBoard(board);
    }
    render() {
        let status = 'Next player: ' + (this.state.blackIsNext ? 'Black' : 'Red');

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        board       = {this.state.board}
                        status      = {status}
                        onClick     = {(i,j) => this.handleClick(i, j)}
                    />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

export default Game;