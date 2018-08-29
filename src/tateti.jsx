import React from 'react';

function Casillero(props) {
  return (
    /* Las propiedades 'value' y 'onClickSquare' son asignadas por la clase 'Board',
    específicamente por el método 'renderSquare'. */
    <button className="square" onClick={props.onClickSquare} >
      {props.value}
    </button>
  );

}

class Board extends React.Component {
  /* Propiedades 
   * squares: desde 'Game'
   * onClickBoard: desde 'Game'
   / Estados: 
   * ninguno
   */
  renderSquare(i) {
    // Este método llama a la función 'Square' para dibujar un casillero. 
    return (
      <Casillero
        /* Asigna el valor i del array 'squares' a la propiedad 'value' de la 
        función 'Square' */
        value={this.props.squares[i]}
        /* Asigna la propiedad/función 'onClickBoard' a la propiedad 'onClickSquare'
        de la función 'Square', convirtiéndola en una función. */
        onClickSquare={() => this.props.onClickBoard(i)} 
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
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,  // Establece que el primer movimiento es 'X'
      stepNumber: 0, // Inicializa el indicador del turno.
      casillaNro: [0], // Inicializa el indicador de la casilla clickeada.
    }
  }

  jumpTo(step) {
    /* Este método actualiza el turno que estamos viendo y quién es el próximo 
    jugador. */
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  /* Este método contiene las instrucciones de que sucede cuando se cliquea 
  un casillero. */
  handleClick(i) {
    // Toma la parte del array 'casillaNro' hasta el turno seleccionado.
    const casillaNro = this.state.casillaNro.slice(0, this.state.stepNumber + 1);
    const casillaClick = i // Toma la casilla clickeada (empieza en 0).

    // Toma la parte del array 'history' hasta el turno seleccionado.
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1]; // Toma el estado actual del tablero
    // Copia el array 'squares' de dentro del array 'current' 
    const squares = current.squares.slice();

    /* Si la función 'calculateWinner' o el elemento 'i' de 'squares' tienen 
      asignados algún valor (o sea que no son 'null'), el hacer click no tiene
      ningún efecto. */
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    /* Asigna el valor 'X' al elemento i del array 'squares' si el estado 
    'xIsNext' es true, 'O' si no */
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      /* Concatena el array 'squares' actual al estado 'history' de 'this', 
      o sea de 'Game' */
      history: history.concat([{ squares: squares }]),
      // Niega el valor del estado 'xIsNext' de 'this', o sea de 'Game' 
      xIsNext: !this.state.xIsNext,
      // Pasa a 'Game' el turno seleccionado.
      stepNumber: history.length,
      // Pasa a 'Game' la casilla clickeada. 
      casillaNro: casillaNro.concat(casillaClick),
    });
  }

  render() {
    /* Propiedades 
    * Ninguna
    / Estados: 
    * history
    * xIsNext
    */
    const casillaNro = this.state.casillaNro;
    const history = this.state.history;
    // Toma el tablero actual
    const currentHistory = history[this.state.stepNumber];
    // Verifica si alguien ya ganado.
    const winner = calculateWinner(currentHistory.squares);
    // Verifica de quién es el turno.
    const quienJuega = this.state.xIsNext ? 'X' : 'O';

    const moves = history.map((step, move) => {
      const label = move ? 'Go to move #' + move +
        " (" + calcCoords(casillaNro[move]).row +
        "," + calcCoords(casillaNro[move]).column + ')' : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{label}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + quienJuega;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            // Asigna el array 'squares' a la propiedad 'squares' de la clase 'Board'
            squares={currentHistory.squares}
            /* Asigna el método 'handleClick' con el argumento 'i' a la propiedad 
            'onClickBoard' de la clase 'Board', convirtiéndola en una función. */
            onClickBoard={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        {/* Added to try */}
        <div className="random">
          <div>Coords: {calcCoords(this.state.casillaNro).row}</div>
          <div>Step number: {this.state.stepNumber}</div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  /* Verifica que los elementos 'a', 'b', 'c' del array 'squares' (dados por el 
  elemento 'i' del array 'lines') son todos idénticos entre si. Si lo son, devuelve 
  ese valor. Recordar que el array 'squares' contiene 'X', 'O', 'null' */
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
    }
  }
  return null;
}

function calcCoords(position) {
  // Calcula las coordenadas de la casilla clickeada.
  const rows = [1, 1, 1, 2, 2, 2, 3, 3, 3];
  const columns = [1, 2, 3, 1, 2, 3, 1, 2, 3];
  return (
    { row: rows[position], column: columns[position] }
  )
}
export default Game