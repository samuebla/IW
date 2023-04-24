import Tablero from './Tablero.js';
import Casilla from './Casilla.js';
import Pieza from './Pieza.js';
export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.movingPiece = false;
        this.pieceToMove = null;
        this.piezas = new Array(16);
    }

    // Cuando es el turno de cada jugador se activa la interactividad de sus piezas
    interactPieces() {
        for (let i of this.piezas) {
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
}
