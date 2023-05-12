import Casilla from './Casilla.js';
import Player from './Player.js';
import Pieza from './Pieza.js';
export default class Tablero {
    constructor(scene, x, y, size) {
        this.scene = scene;

        this.x = x;
        this.y = y;
        this.size = size;
        this.filas = 14;
        this.columnas = 14;
        this.sizeFila = this.size / this.filas;
        this.sizeColumna = this.size / this.columnas;
        this.color = 0xffffff;

        this.createTablero();
    }

    createTablero() {
        let black = 0x000000;
        let white = 0xffffff;


        // La parte del centro (Izquierda centro y derecha)
        for (let j = 0; j < this.columnas; j++) {
            this.changeColor(white, black);
            for (let i = 3; i < this.filas - 3; i++) {
                this.changeColor(white, black);
                // Se crea una casilla y se asigna al array global scene.board
                this.scene.board[i][j] = new Casilla(this.scene, i * this.sizeFila + this.x, j * this.sizeColumna + this.y, this.sizeFila, this.sizeColumna, this.color, i, j);
            }
        }

        // La parte de arriba
        for (let j = 3; j < this.columnas - 3; j++) {
            for (let i = 0; i < 3; i++) {
                this.scene.board[i][j] = new Casilla(this.scene, i * this.sizeFila + this.x, j * this.sizeColumna + this.y, this.sizeFila, this.sizeColumna, this.color, i, j);
                this.changeColor(white, black);
            }
        }

        this.changeColor(white, black);
        // La parte de abajo
        for (let j = 3; j < this.columnas - 3; j++) {
            for (let i = this.filas - 3; i < this.filas; i++) {
                this.scene.board[i][j] = new Casilla(this.scene, i * this.sizeFila + this.x, j * this.sizeColumna + this.y, this.sizeFila, this.sizeColumna, this.color, i, j);
                this.changeColor(white, black);
            }
        }

    }

    changeColor(white, black) {
        this.color = this.color === black ? white : black;
    }
}