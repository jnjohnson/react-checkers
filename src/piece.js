function Piece(props) {
    const king = (props.king ? 'king' : '');
    return (
        <div className={'piece ' + props.team + ' ' + king}></div>
    )
}

export default Piece;