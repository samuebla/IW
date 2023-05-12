import Tablero from './Tablero.js';
import Casilla from './Casilla.js';
import Pieza from './Pieza.js';
export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.movingPiece = false;
        this.pieceToMove = null;
        //Creamos las 16 piezas del jugador
        this.piezas = new Array(16);
    }
    // Si te comes una pieza destruyes el Sprite

    // Cuando es el turno de cada jugador se activa la interactividad de sus piezas
    interactPieces() {
        for (let i of this.piezas) {
            //Si está dentro del tablero (Que tenga sprite)
            if (i.sprite && i.sprite.active && i.sprite.visible)
                i.sprite.setInteractive();
        }
    }

    // Cuando deja de ser su turno se vuelven a desactivar
    disablePieces() {
        for (let i of this.piezas) {
            if (i.sprite && i.sprite.active && i.sprite.visible)
                i.sprite.disableInteractive();
        }
    }

    eliminaPiezas(){
        for (let i of this.piezas) {
            //Eliminamos su sprite
            i.sprite.destroy();
            //Y ponemos la pieza del tablero a null para que pierda toda la info
            this.scene.board[i.tableroX][i.tableroY].pieza = null
        }
    }
}