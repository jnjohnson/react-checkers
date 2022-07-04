import React from 'react';
import Piece from './piece.js';

class Square extends React.Component {
    // TODO: check to see if square has piece. Currently all squares have pieces
    renderPiece() {
        if (this.props.data.hasPiece) {
            return <Piece 
                team={this.props.data.hasPiece ? this.props.data.piece.color : null}
                king={this.props.data.piece.isKing}
            />
        } else {
            return;
        }
    }
    
    render() {
        var classes = 'square ' + (this.props.data.clicked ? 'clicked ' : '') + (this.props.data.canMoveTo ? 'safe' : '');
        return (
            <button className={classes} onClick={this.props.onClick}>
                {this.renderPiece()}
            </button>
        );
    }
}

export default Square;