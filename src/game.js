import React from 'react';
import Board from './board.js';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            blackIsNext: true,
            blkCount: 12,
            board: this.initBoard(),
            currentPiece: null,
            moves: [0][0],
            redCount: 12,
            gameOver: false,
            winner: null
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
    // - Determine the direction that the piece will be moving (for setting direction of arrow to show movement)
    getJumpDirection(move) {
        const iVector = move.jump.i - move.i;
        const jVector = move.jump.j - move.j;
        if (iVector === -1 && jVector === -1) {
            return 'arrow down-right';
        } else if (iVector === -1 && jVector === 1) {
            return 'arrow down-left';
        } else if (iVector === 1 && jVector === -1) {
            return 'arrow up-right';
        } else if (iVector === 1 && jVector === 1) {
            return 'arrow up-left';
        }
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
                color: square.piece.color,
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
    // - Checks to see if either side has won the game
    checkForWinner() {
        const side1 = this.state.blackIsNext ? 'black' : 'red';
        const side2 = this.state.blackIsNext ? 'red' : 'black';
        const side1HasValidMoves = this.checkForAnyValidMoves(side1);
        const side2HasValidMoves = this.checkForAnyValidMoves(side2);
        if (!side1HasValidMoves && side2HasValidMoves) {
            const loser = this.state.blackIsNext ? 'Black' : 'Red';
            const winner = this.state.blackIsNext ? 'Red' : 'Black'; 
            return 'Game Over. ' + loser + ' has no valid moves left. ' + winner + ' wins!';
        } else if (!side1HasValidMoves && !side2HasValidMoves) {
            console.debug('still figuring this out');
        }
        if (this.state.redCount === 0) {
            return 'Game Over. Black Wins!';
        } else if (this.state.blkCount === 0) {
            return 'Game Over. Red Wins!';
        }
        return false;
    }
    // - Check to see if a side has any valid moves left. If not, it is game over
    checkForAnyValidMoves(color) {
        var validMoves;
        for (var i=0; i<this.props.rows; i++) {
            for (var j=0; j<this.props.columns; j++) {
                if (this.hasPiece(i, j) && this.getPieceColor(i, j) === color) {
                    validMoves = this.getValidMoves(i, j);
                    if (validMoves.length !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    // - Sets data.clicked and data.canMoveTo to false for every square on the board
    resetBoard() {
        const board = this.getBoardCopy();
        for (var i=0; i<this.props.rows; i++) {
            for (var j=0; j<this.props.columns; j++) {
                board[i][j].clicked = false;
                board[i][j].canMoveTo = false;
                board[i][j].jumps = [];
                board[i][j].jumpDirection = null;
            }
        }
        this.setState({
            board: board,
            currentPiece: null
        });
    }
    // Returns the initial state of a square
    resetSquare(i, j) {
        return {
            i: i,
            j: j,
            jumpDirection: null,
            clicked: false,
            canMoveTo: false,
            hasPiece: false,
            hasBeenJumped: false,
            jumps: [],
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
        const data = this.resetSquare(i, j);
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
        const jumps = board[i][j].jumps;
        var blkCount = this.state.blkCount;
        var redCount = this.state.redCount;
        board[piece.i][piece.j] = this.resetSquare(piece.i, piece.j);
        jumps.forEach(jump => {
            board[jump.i][jump.j] = this.resetSquare(jump.i, jump.j);
            if (piece.color === 'red') {
                blkCount--;
            } else if (piece.color === 'black') {
                redCount--;
            }
        });
        piece.square.i = i;
        piece.square.j = j;
        board[i][j] = piece.square;
        if ((i === 0 && piece.square.piece.color === 'black') || (i === this.props.rows - 1 && piece.square.piece.color === 'red')) {
            board[i][j].piece.isKing = true;
        }
        this.setState({redCount: redCount, blkCount: blkCount});
        this.setBoard(board);
    }
    // Handles what happens when a square is clicked
    // Resets the data.clicked and data.canMoveTo flags for each square
    // If the square has a piece on it, highlight the piece and it's available moves
    handleClick(i, j) {
        if (this.checkForWinner()) {
            return;
        }
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

            if (move.jump) {
                if (move.jump.prev && board[move.jump.prev.i][move.jump.prev.j].jumps.length !== 0) {
                    board[move.i][move.j].jumps.push(...board[move.jump.prev.i][move.jump.prev.j].jumps);
                }
                board[move.i][move.j].jumps.push(move.jump);
                board[move.jump.i][move.jump.j].jumpDirection = this.getJumpDirection(move);
            }
        });
        this.setBoard(board);
    }

    // - Returns a list of valid moves
    getValidMoves(i, j, prevSquares = [], isJump = false) {
        var moves = [{i: i+1, j: j+1, iDir: 1, jDir: 1}, {i: i+1, j: j-1, iDir: 1, jDir: -1}, {i: i-1, j: j+1, iDir: -1, jDir: 1}, {i: i-1, j: j-1, iDir: -1, jDir: -1}];
        var validMoves = [];
        const square = this.getSquare(i, j);
        const piece = (prevSquares.length === 0 ? square.piece : prevSquares[0].piece);
        if (!piece.isKing) {
            if (piece.color === 'red') {
                moves.splice(2, 2);
            } else {
                moves.splice(0, 2);
            }
        }
        moves.forEach(move => {
            if (!isJump && this.checkIfInBounds(move.i, move.j) && !this.hasPiece(move.i, move.j)) {
                validMoves.push(move);
            } else if (this.checkIfInBounds(move.i, move.j) && this.hasPiece(move.i, move.j) && this.getPieceColor(move.i, move.j) !== piece.color) {
                if (prevSquares.length !== 0) {
                    var isLooping = false;
                    prevSquares.every(prev => {
                        if (prev.i === move.i + move.iDir && prev.j === move.j + move.jDir) {
                            isLooping = true;
                            return false;
                        }
                        return true;
                    });
                    if (isLooping) {
                        return;
                    }
                }
                if (this.checkIfInBounds(move.i + move.iDir, move.j + move.jDir) && !this.hasPiece(move.i + move.iDir, move.j + move.jDir)) {
                    prevSquares.push(square);
                    validMoves.push({i: move.i + move.iDir, j: move.j + move.jDir, jump: {i: move.i, j: move.j, prev: {i: i, j: j}}});
                    validMoves.push(...this.getValidMoves(move.i + move.iDir, move.j + move.jDir, prevSquares, true));
                }
            }
        });
        return validMoves;
    }

    render() {
        let status;
        let winner = this.checkForWinner();
        if (winner) {
            status = winner;
        } else {
            status = 'Next player: ' + (this.state.blackIsNext ? 'Black' : 'Red');
        }

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