import React from 'react';
import Board from './board.js';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            blackIsNext: true,
            board: this.initBoard(),
            currentPiece: null,
        }
    }

    // --- HELPER FUNCTIONS --- //
    // - Get the board (for checking variables)
    getBoard() {
        return this.state.board;
    }
    // - Get a copy of the board (for setting state)
    getBoardCopy() {
        return this.state.board.slice();
    }
    // - Get a square on the board (for checking variables)
    getSquare(i, j) {
        return this.state.board[i][j];
    }
    // - Get a copy of a square on the board (for setting state)
    getSquareCopy(i, j) {
        return this.state.board.slice()[i][j];
    }
    // - Get the current piece being selected
    getCurrentPiece() {
        return this.state.currentPiece;
    }
    // - Sets the state of board
    setBoard(board) {
        this.setState({
            board: board
        })
    }
    // - Sets the state of a square on the board
    setSquare(i, j, square) {
        const board = this.getBoardCopy();
        board[i][j] = square;
        this.setCurrentPiece(i, j, square);
        this.setBoard(board);
    }
    // - Set the currently selected piece
    setCurrentPiece(i,j, square) {
        this.setState({
            currentPiece: {
                i: i,
                j: j,
                square: square,
            }
        });
    }
    // - Check to see if the square at i, j has a piece
    hasPiece(i, j) {
        return this.state.board[i][j].hasPiece;
    }
    // Get the color of the piece on the square at i, j
    getPieceColor(i, j) {
        return this.state.board[i][j].piece.color;
    }
    // - Check to see if the square at i, j has a piece of the right color
    hasRightColorPiece(i, j) {

        if (this.hasPiece(i, j) && this.state.blackIsNext && this.getPieceColor(i, j) === 'black') {
            return true;
        } else if (this.hasPiece(i, j) && !this.state.blackIsNext && this.getPieceColor(i, j) === 'red') {
            return true;
        } else {
            return false;
        }
    }
    // - Check to see if the square at i, j can be moved to
    canMoveTo(i, j) {
        return this.state.board[i][j].canMoveTo;
    }
    // - Check to see if index i, j is within the bounds of the boad
    checkIfInBounds(i, j) {
        if ( i >= 0 && i < this.props.rows && j >= 0 && j < this.props.columns) {
            return true;
        } else {
            return false;
        }
    }
    // - Returns a list of valid moves
    getValidMoves(i, j, prevSquare = null) {
        var moves = [{i: i+1, j: j+1, iDir: 1, jDir: 1}, {i: i+1, j: j-1, iDir: 1, jDir: -1}, {i: i-1, j: j+1, iDir: -1, jDir: 1}, {i: i-1, j: j-1, iDir: -1, jDir: -1}];
        var validMoves = [];
        const square = (prevSquare ? prevSquare : this.getSquare(i, j));

        if (!square.piece.isKing) {
            if (square.piece.color === 'red') {
                moves.splice(2, 2);
            } else {
                moves.splice(0, 2);
            }
        }
        moves.forEach(move => {
            if (this.checkIfInBounds(move.i, move.j) && !this.hasPiece(move.i, move.j)) {
                validMoves.push(move);
            } else if (this.checkIfInBounds(move.i, move.j) && this.hasPiece(move.i, move.j) && this.getPieceColor(move.i, move.j) !== square.piece.color) {
                if (this.checkIfInBounds(move.i + move.iDir, move.j + move.jDir) && !this.hasPiece(move.i + move.iDir, move.j + move.jDir)) {
                    validMoves.push({i: move.i + move.iDir, j: move.j + move.jDir});
                    validMoves.push(...this.getValidMoves(move.i + move.iDir, move.j + move.jDir, square));
                }
            }
        });
        return validMoves;
    }
    // - Sets data.clicked and data.canMoveTo to false for every square on the board
    resetBoard() {
        const board = this.getBoardCopy();
        for (var i=0; i<this.props.rows; i++) {
            for (var j=0; j<this.props.columns; j++) {
                board[i][j].clicked = false;
                board[i][j].canMoveTo = false;
            }
        }
        this.setBoard(board);
        this.setState({
            currentPiece: null
        });
    }
    // Returns the initial state of a square
    resetSquare() {
        return {
            clicked: false,
            canMoveTo: false,
            hasPiece: false,
            piece: {
                color: '',
                isKing: false,
            }
        }
    }

    // --- INITIALIZATION FUNCTIONS --- //
    // - Initializes the board
    initBoard() {
        const board = Array(this.props.rows).fill(null).map(row => new Array(this.props.columns).fill(null));
        for (var i=0; i<this.props.rows; i++) {
            for (var j=0; j<this.props.columns; j++) {
                board[i][j] = this.initSquare(i, j);
            }
        }
        return board;
    }
    // - Initializes the data for a square on the board 
    initSquare(i, j) {
        const data = this.resetSquare();
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

    // --- MISCELLANEOUS FUNCTIONS --- //
    // Resets the old position of the piece and sets the new position
    movePieceTo(i, j) {
        const piece = this.getCurrentPiece();
        const board = this.getBoardCopy();
        board[piece.i][piece.j] = this.resetSquare(piece.i, piece.j);
        board[i][j] = piece.square;
        this.setBoard(board);
    }
    // Handles what happens when a square is clicked
    // Resets the data.clicked and data.canMoveTo flags for each square
    // If the square has a piece on it, highlight the piece and it's available moves
    handleClick(i, j) {
        if (this.hasRightColorPiece(i, j)) {
            this.resetBoard();
            this.checkMoves(i, j);
            const square = this.getSquareCopy(i, j);
            square.clicked = true;
            this.setSquare(i, j, square);
        } else if (this.canMoveTo(i, j)) {
            this.movePieceTo(i, j);
            this.resetBoard();
            this.setState({blackIsNext: !this.state.blackIsNext});
        } else {
            this.resetBoard();
        }
    }

    // Checks to see what moves are available for a given piece
    checkMoves(i, j) {
        const moves = this.getValidMoves(i, j);
        const board = this.getBoardCopy();
        moves.forEach(move => {
            board[move.i][move.j].canMoveTo = true;
        });
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