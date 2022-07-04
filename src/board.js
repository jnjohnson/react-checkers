import Square from './square.js';
import React from 'react';

class Board extends React.Component {
    renderSquare(i, j) {
        const key = i.toString() + j.toString();
        return (
            <Square
                key     = {key}
                data    = {this.props.board[i][j]}
                onClick = {() => this.props.onClick(i, j)}
            />
        );
    }
    render() {
        return (
        <div>
            <div className="status">{this.props.status}</div>
            <div className="column-num">
            {this.props.board.map((row, i) => (
                <div key={'column-'+i}>{i}</div>
            ))}
            </div>
            {this.props.board.map((row, i) => (
                <div key={'row-'+i} className="row">
                    <div className="row-num">{i}</div>
                    {row.map((column, j) => this.renderSquare(i, j))}
                </div>
            ))}
        </div>
        );
    }
}

export default Board;