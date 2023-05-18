import Tablero from './Tablero.js';
import Player from './Player.js';
import Pieza from './Pieza.js';
export default class Casilla extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, fillColor, tabX, tabY) {
        super(scene, x, y, width, height, fillColor);
        scene.add.existing(this);
        this.setOrigin(0, 0);
        //8 o 15 = Torre || 10 o 13 =  Alfil || 9 o 14 = Caballo || 11 = Reina || 12 = Rey;
        this.pieza = null;
        this.originalColor = fillColor;

        this.possible = false;

        this.x = x;
        this.y = y;

        // Posición lógica de la casilla dentro del tablero
        this.xTablero = tabX;
        this.yTablero = tabY;


        this.setInteractive();
        this.on('pointerdown', (pointer) => {
            // Comprueba si la casilla es válida para el movimiento
            if (this.possible) {
                if (scene.players[scene.turn].movingPiece) {

                    go(`${config.rootUrl}/partida/${scene.lobbyId}/pieceMoved`, 'POST', {
                        pieceTeam: scene.players[scene.turn].pieceToMove.equipo,
                        pieceType: scene.players[scene.turn].pieceToMove.tipo,
                        //Posicion previa de la pieza
                        boardX: scene.players[scene.turn].pieceToMove.tableroX,
                        boardY: scene.players[scene.turn].pieceToMove.tableroY,
                        //Posicion a la que quieres avanzar
                        newBoardX: this.xTablero,
                        newBoardY: this.yTablero
                    })
                        .then(d => console.log("Envio Pieza WEEEE", d))
                        .catch(e => console.log(e, "CUIDAOOOOO"))
                }
            }

        });
    }

    // Se cambia el color de la casilla cuando es una jugada válida
    colorPossible() {
        this.possible = true;
        this.fillColor = 0x6a6a6a;
    }

    // Se vuelve al color original
    colorReset() {
        this.fillColor = this.originalColor;
    }

    // Se asigna la pieza a esta casilla y se cambia la posición de la pieza dentro del tablero
    setPieza(p, x, y) {
        this.pieza = p;
        this.pieza.tableroX = x;
        this.pieza.tableroY = y;
    }

    // Cuando finaliza un turno, se settean todas las casillas del tablero a possible = false, para que no se puedan mover de manera residual
    quitarPossible() {
        this.scene.board.forEach(element => {
            element.forEach(casilla => {
                if (casilla) {
                    casilla.possible = false;
                    casilla.colorReset();
                }
            })
        });
    }

    eliminaEquipo() {
        this.scene.equiposEliminados.push(this.pieza.equipo);
        this.scene.players[this.pieza.equipo].eliminaPiezas();

        // Se settea la nueva pieza
        this.pieza = this.scene.players[this.scene.turn].pieceToMove;
    }

    calculaPeon() {
        // Si es un peon blanco...
        if (this.pieza.equipo === 0 && this.pieza.tableroY === 0) {
            this.pieza.sprite.setTexture("white_pieces", 4);
            this.pieza.tipo = 11;
        }
        // Si es un peon rojo...
        else if (this.pieza.equipo === 1 && this.pieza.tableroX === 13) {
            this.pieza.sprite.setTexture("red_pieces", 4);
            this.pieza.tipo = 11;
        }
        // Si es un peon negro...
        else if (this.pieza.equipo === 2 && this.pieza.tableroY === 13) {
            this.pieza.sprite.setTexture("black_pieces", 4);
            this.pieza.tipo = 11;
        }
        // Si es un peon azul...
        else if (this.pieza.equipo === 3 && this.pieza.tableroX === 0) {
            this.pieza.sprite.setTexture("blue_pieces", 4);
            this.pieza.tipo = 11;
        }

    }

    moverPieza() {
        // Se mueve la pieza al centro de la casilla
        this.scene.players[this.scene.turn].pieceToMove.sprite.x = this.x + 8;
        this.scene.players[this.scene.turn].pieceToMove.sprite.y = this.y + 8;
        this.scene.players[this.scene.turn].movingPiece = false;

        this.quitarPossible();
        // Cambio de turno
        if (this.scene.turn + 1 > 3) this.scene.turn = 0;
        else this.scene.turn++;

        while (this.scene.equiposEliminados.includes(this.scene.turn)) {
            if (this.scene.turn + 1 > 3) this.scene.turn = 0;
            else this.scene.turn++;
        }


        // Actualiza la posición lógica de la pieza dentro del tablero
        this.scene.board[this.pieza.tableroX][this.pieza.tableroY].pieza = null;
        this.pieza.tableroX = this.xTablero;
        this.pieza.tableroY = this.yTablero;

        if (this.pieza.tipo < 8) {
            this.calculaPeon();
        }

        this.scene.players[this.scene.turn].interactPieces();
    }

    movePieceTo(pieza) {
        this.scene.players[this.scene.turn].disablePieces();
        if (this.pieza !== null) {
            // Si es el rey
            if (this.pieza.tipo === 12) {
                this.eliminaEquipo();
                // Si solo queda un rey se lanza la pantalla final
                if (this.scene.equiposEliminados.length >= 3) {
                    this.scene.start("final", { won: true });
                }
            } else {
                // Si ya había una pieza se destruye y se coloca la nueva encima
                this.pieza.sprite.destroy();
                this.pieza = pieza;
            }

        } else {
            // Si no había otra pieza simplemente se coloca la nueva
            this.pieza = pieza;
        }

        // Se mueve la pieza al centro de la casilla
        this.pieza.sprite.x = this.x + 8;
        this.pieza.sprite.y = this.y + 8;

        this.scene.players[this.scene.turn].movingPiece = false;
        this.quitarPossible();
        
        // Cambio de turno
        if (this.scene.turn + 1 > 3) this.scene.turn = 0;
        else this.scene.turn++;

        while (this.scene.equiposEliminados.includes(this.scene.turn)) {
            if (this.scene.turn + 1 > 3) this.scene.turn = 0;
            else this.scene.turn++;
        }


        // Actualiza la posición lógica de la pieza dentro del tablero
        if( this.pieza.tableroX !== this.xTablero && this.pieza.tableroY !== this.yTablero)
            this.scene.board[this.pieza.tableroX][this.pieza.tableroY].pieza = null;
            
        this.pieza.tableroX = this.xTablero;
        this.pieza.tableroY = this.yTablero;

        if (this.pieza.tipo < 8) {
            this.calculaPeon();
        }

        this.scene.players[this.scene.turn].interactPieces();
    }
}