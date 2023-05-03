import Tablero from './Tablero.js';
import Player from './Player.js';
import Pieza from './Pieza.js';
export default class Casilla extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, fillColor, tabX, tabY) {
        super(scene, x, y, width, height, fillColor);
        scene.add.existing(this);
        this.setOrigin(0, 0);
        this.pieza = null;
        this.originalColor = fillColor;

        this.possible = false;

        // Posición lógica de la casilla dentro del tablero
        this.xTablero = tabX;
        this.yTablero = tabY;

        this.setInteractive();
        this.on('pointerdown', (pointer) => {
            // Comprueba si la casilla es válida para el movimiento
            if (this.possible) {
                if (scene.players[scene.turn].movingPiece) {
                    scene.players[scene.turn].disablePieces();
                    if (this.pieza !== null) {
                        // Si es el rey
                        if(this.pieza.tipo === 12){
                            this.eliminaEquipo();
                        }
                        else{
                            // Si ya había una pieza se destruye y se coloca la nueva encima
                            this.pieza.sprite.destroy();
                            this.pieza = scene.players[scene.turn].pieceToMove;
                        }
                        
                    }
                    else {
                        // Si no había otra pieza simplemente se coloca la nueva
                        this.pieza = scene.players[scene.turn].pieceToMove;
                    }

                    // Se mueve la pieza al centro de la casilla
                    scene.players[scene.turn].pieceToMove.sprite.x = x + 8;
                    scene.players[scene.turn].pieceToMove.sprite.y = y + 8;
                    scene.players[scene.turn].movingPiece = false;

                    this.quitarPossible();
                    // Cambio de turno
                    if (scene.turn + 1 > 3) scene.turn = 0;
                        else scene.turn++;

                    while(scene.equiposEliminados.includes(scene.turn)){
                        if (scene.turn + 1 > 3) scene.turn = 0;
                        else scene.turn++;
                    }
                    

                    // Actualiza la posición lógica de la pieza dentro del tablero
                    scene.board[this.pieza.tableroX][this.pieza.tableroY].pieza = null;
                    this.pieza.tableroX = this.xTablero;
                    this.pieza.tableroY = this.yTablero;

                    if(this.pieza.tipo < 8){
                        this.calculaPeon();
                    }

                    scene.players[scene.turn].interactPieces();
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

    eliminaEquipo(){
        this.scene.equiposEliminados.push(this.pieza.equipo);
        this.scene.players[this.pieza.equipo].eliminaPiezas();

        // Se settea la nueva pieza
        this.pieza = this.scene.players[this.scene.turn].pieceToMove;
    }

    calculaPeon(){
        // Si es un peon blanco...
        if(this.pieza.equipo === 0 && this.pieza.tableroY === 0){
            this.pieza.sprite.setTexture("white_pieces", 4);
            this.pieza.tipo = 11;
        }
        else if(this.pieza.equipo === 1 && this.pieza.tableroX === 13){
            this.pieza.sprite.setTexture("red_pieces", 4);
            this.pieza.tipo = 11;
        }
        else if(this.pieza.equipo === 2 && this.pieza.tableroY === 13){
            this.pieza.sprite.setTexture("black_pieces", 4);
            this.pieza.tipo = 11;
        }
        else if(this.pieza.equipo === 3 && this.pieza.tableroX === 0){
            this.pieza.sprite.setTexture("blue_pieces", 4);
            this.pieza.tipo = 11;
        }
        
    }
}