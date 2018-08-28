import React from 'react'

function Square(props) {
  return (
    /* Las propiedades 'value' y 'alClickear' son asignadas por la clase 'Board',
    específicamente por el método 'renderSquare'. */
    <button className="square" onClick={props.alClickear} >
      {props.value}
    </button>
  );

}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true // Establece que el primer movimiento es 'X'
    };
  }

  /* Este método contiene las instrucciones de que sucede cuando se cliquea 
  * un casillero. */
  handleClick(i) {
    /* Propiedades: 
    * i: prop desde 'renderSquare'
    / Estados: 
    * squares
    * xIsNext
    */
    const squares = this.state.squares.slice(); /* Copia el array 'squares' definido
                                                en el estado de la clase 'Board' */
    if (calculateWinner(squares) || squares[i]) {
      return;
    } /* Si la función 'calculateWinner' o el elemento 'i' de 'squares' tienen 
      asignados algún valor (o sea que no son 'null'), el hacer click no tiene
      ningún efecto. */
    squares[i] = this.state.xIsNext ? 'X' : 'O'; /* Asigna el valor 'X' al elemento i
                                                 del array 'squares' si el estado 
                                                 'xIsNext' es true, 'O' si no */
    this.setState({
      squares: squares,  /* Asigna el array 'squares' actual al estado de 'this', 
                         o sea de 'Board' */
      xIsNext: !this.state.xIsNext, /* Niega el valor del estado 'xIsNext' de
                                    'this', o sea de 'Board' */
    });
  }

  // Este método llama a la función 'Square' para dibujar un casillero. 
  renderSquare(i) {
    /* Propiedades 
    * i: desde el llamado.
    / Estados: 
    * squares
    * xIsNext
    */
   return (
      <Square
        value={this.state.squares[i]} /* Asigna el valor i del array 'squares' a la
                                      propiedad 'value' de la función 'Square' */
        alClickear={() => this.handleClick(i)} /* Asigna la función 'handleClick'
                                               a la propiedad 'alClickear' de la 
                                               función 'Square', convirtiéndola en una
                                               función. */
      />
    );
  }

  render() {
    /* Propiedades 
    * Ninguna
    / Estados: 
    * squares
    * xIsNext
    */
   const quienJuega = this.state.xIsNext ? 'X' : 'O'; /* Verifica de quién es el
                                                       turno. */
    const winner = calculateWinner(this.state.squares); /* Verifica si alguien ya
                                                        ha ganado. */
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + quienJuega;
    }

    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
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

function calculateWinner(squares) {
  const lines = [
    // Líneas
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columnas 
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonales
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    } /* Verifica que los elementos 'a', 'b', 'c' del array 'squares' (dados por el 
      elemento 'i' del array 'lines') son todos idénticos entre si. Si lo son, 
      devuelve ese valor. Recordar que el array 'squares' 
      contiene 'X', 'O', 'null' */
  }
  return null;
}

export default Game