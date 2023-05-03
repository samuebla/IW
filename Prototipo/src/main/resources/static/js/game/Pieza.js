import Tablero from './Tablero.js';
import Casilla from './Casilla.js';
import Player from './Player.js';

export default class Pieza {
    constructor(scene, s, t, e) {
        this.scene = scene;
        this.tipo = t;
        this.equipo = e;

        this.tableroX;
        this.tableroY;

        this.sprite = s;
        this.sprite.setInteractive();

        // Hacemos la pieza interactiva
        this.sprite.on('pointerdown', (pointer) => {
            // Si se está moviendo ya una pieza, pero se pulsa otra, cambia las casillas posibles y el pieceToMove
            if (scene.players[scene.turn].movingPiece && this !== scene.players[scene.turn].pieceToMove) {
                scene.players[scene.turn].movingPiece = false;
                scene.board[this.tableroX][this.tableroY].quitarPossible();
                scene.players[scene.turn].pieceToMove = null;
            }
            // Mover la pieza
            if (!scene.players[scene.turn].movingPiece) {
                // Avisa de que el jugador va a mover una pieza y que es pieceToMove
                scene.players[scene.turn].movingPiece = true;
                scene.players[scene.turn].pieceToMove = this;

                if (this.tipo >= 8) {
                    // Si es una torre...
                    if (this.tipo === 8 || this.tipo === 15)
                        this.compruebaTorre();

                    //Si es un alfil...
                    else if (this.tipo === 10 || this.tipo === 13)
                        this.compruebaAlfil();

                    // Si es un caballo
                    else if (this.tipo === 9 || this.tipo === 14)
                        this.compruebaCaballo();

                    // Si es una reina...
                    else if (this.tipo === 11)
                        this.compruebaReina();

                    // Si es el rey...
                    else
                        this.compruebaRey();
                }
                else {
                    //Si eres el equipo blanco
                    if (scene.turn === 0) {
                        //Si es un peon...
                        let arribaIzq = scene.board[this.tableroX - 1][this.tableroY - 1];
                        let arriba = scene.board[this.tableroX][this.tableroY - 1];
                        let arribax2 = null;
                        if(this.tableroY === 12){
                            arribax2 = scene.board[this.tableroX][this.tableroY - 2];
                        }
                        let arribaDer = scene.board[this.tableroX + 1][this.tableroY - 1];

                        // Se calculan las casillas a las que puede avanzar la pieza y se llama al tablero para que las cambie de color
                        // Además cada casilla tiene un booleano para saber si es válida o no, la gestión de mover la pieza se da en la clase casilla
                        if (arriba && arriba.pieza === null) {
                            // Se entra si la casilla existe y si está vacía
                            if (this.tableroY === 12) {
                                // Se entra si es el primer movimiento del peón
                                arriba.colorPossible();
                                if (arribax2 && arribax2.pieza === null)
                                    arribax2.colorPossible();
                            }
                            else {
                                arriba.colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if (arribaIzq && arribaIzq.pieza !== null) {
                            if (arribaIzq.pieza.equipo !== this.equipo)
                                arribaIzq.colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if (arribaDer && arribaDer.pieza !== null) {
                            if (arribaDer.pieza.equipo !== this.equipo)
                                arribaDer.colorPossible();

                        }

                    }
                    // Si eres el equipo rojo
                    else if (scene.turn === 1) {
                        //Si es un peon...
                        let abajoDer = scene.board[this.tableroX + 1][this.tableroY + 1];
                        let der = scene.board[this.tableroX + 1][this.tableroY];
                        let derx2 = null;
                        if(this.tableroX === 1){
                            derx2 = scene.board[this.tableroX + 2][this.tableroY];
                        }
                        let arribaDer = scene.board[this.tableroX + 1][this.tableroY - 1];

                        if (der && der.pieza === null) {
                            if (this.tableroX === 1) {
                                der.colorPossible();
                                if (derx2 && derx2.pieza === null)
                                    derx2.colorPossible();
                            }
                            else {
                                der.colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if (arribaDer && arribaDer.pieza !== null) {
                            if (arribaDer.pieza.equipo !== this.equipo)
                                arribaDer.colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if (abajoDer && abajoDer.pieza !== null) {
                            if (abajoDer.pieza.equipo !== this.equipo)
                                abajoDer.colorPossible();
                        }

                    }
                    // Si eres el equipo negro
                    else if (scene.turn === 2) {
                        //Si es un peon...
                        let abajoIzda = scene.board[this.tableroX - 1][this.tableroY + 1];
                        let abajo = scene.board[this.tableroX][this.tableroY + 1];
                        let abajox2 = null;
                        if(this.tableroY === 1){
                            abajox2 = scene.board[this.tableroX][this.tableroY + 2];
                        }
                        let abajoDer = scene.board[this.tableroX + 1][this.tableroY + 1];

                        if (abajo && abajo.pieza === null) {
                            if (this.tableroY === 1) {
                                abajo.colorPossible();
                                if (abajox2 && abajox2.pieza === null)
                                    abajox2.colorPossible();
                            }
                            else {
                                abajo.colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if (abajoIzda && abajoIzda.pieza !== null) {
                            if (abajoIzda.pieza.equipo !== this.equipo)
                                abajoIzda.colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if (abajoDer && abajoDer.pieza !== null) {
                            if (abajoDer.pieza.equipo !== this.equipo)
                                abajoDer.colorPossible();
                        }

                    }
                    // Si eres el equipo azul
                    else if (scene.turn === 3) {
                        //Si es un peon...
                        let arribaIzq = scene.board[this.tableroX - 1][this.tableroY - 1];
                        let izda = scene.board[this.tableroX - 1][this.tableroY];
                        let izdax2 = null;
                        if(this.tableroX === 12){
                            izdax2 = scene.board[this.tableroX - 2][this.tableroY];
                        }
                        let abajoIzda = scene.board[this.tableroX - 1][this.tableroY + 1];

                        if (izda && izda.pieza === null) {
                            if (this.tableroX === 12) {
                                izda.colorPossible();
                                if (izdax2 && izdax2.pieza === null)
                                    izdax2.colorPossible();
                            }
                            else {
                                izda.colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if (arribaIzq && arribaIzq.pieza !== null) {
                            if (arribaIzq.pieza.equipo !== this.equipo)
                                arribaIzq.colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if (abajoIzda && abajoIzda.pieza !== null) {
                            if (abajoIzda.pieza.equipo !== this.equipo)
                                abajoIzda.colorPossible();
                        }
                    }
                }

            }

        }).disableInteractive();

        // Si el jugador en su turno pasa el ratón sobre una de sus piezas se pone en grande 
        this.sprite.on('pointerover', (pointer) => {
            this.sprite.setScale(1.5);
            this.sprite.setDepth(1);

        }).disableInteractive();

        // Cuando se deja de pasar el ratón se pone pequeña otra vez
        this.sprite.on('pointerout', (pointer) => {
            this.sprite.setScale(1);
        }).disableInteractive();
    }

    compruebaRey() {
        this.casillaUnica({ x: 0, y: 1 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: 0, y: -1 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: 1, y: 0 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: -1, y: 0 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: 1, y: 1 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: -1, y: -1 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: 1, y: -1 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: -1, y: 1 }, this.tableroX, this.tableroY);
    }

    compruebaReina() {
        this.casillaRecursiva({ x: 0, y: 1 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: 0, y: -1 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: 1, y: 0 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: -1, y: 0 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: 1, y: 1 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: -1, y: -1 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: 1, y: -1 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: -1, y: 1 }, this.tableroX, this.tableroY);
    }

    compruebaCaballo() {
        this.casillaUnica({ x: 2, y: 1 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: 2, y: -1 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: -2, y: 1 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: -2, y: -1 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: 1, y: 2 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: -1, y: 2 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: 1, y: -2 }, this.tableroX, this.tableroY);
        this.casillaUnica({ x: -1, y: -2 }, this.tableroX, this.tableroY);
    }

    compruebaAlfil() {
        // Calcula las 4 direcciones
        this.casillaRecursiva({ x: 1, y: 1 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: -1, y: -1 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: 1, y: -1 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: -1, y: 1 }, this.tableroX, this.tableroY);
    }

    compruebaTorre() {
        // Calcula las 4 direcciones
        this.casillaRecursiva({ x: 0, y: 1 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: 0, y: -1 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: 1, y: 0 }, this.tableroX, this.tableroY);
        this.casillaRecursiva({ x: -1, y: 0 }, this.tableroX, this.tableroY);
    }

    // Método que calcula las casillas posibles de la torre de manera recursiva
    casillaRecursiva(dir, x, y) {
        if (x + dir.x < 0 || x + dir.x > 13 || y + dir.y < 0 || y + dir.y > 13) return;

        if (this.scene.board[x + dir.x][y + dir.y]) {
            if (this.scene.board[x + dir.x][y + dir.y].pieza === null) {
                this.scene.board[x + dir.x][y + dir.y].colorPossible();
                this.casillaRecursiva(dir, x + dir.x, y + dir.y);
            }
            else if (this.scene.board[x + dir.x][y + dir.y].pieza.equipo !== this.equipo) {
                this.scene.board[x + dir.x][y + dir.y].colorPossible();

            }
        }
    }

    casillaUnica(dir, x, y) {
        if (x + dir.x < 0 || x + dir.x > 13 || y + dir.y < 0 || y + dir.y > 13) return;

        if (this.scene.board[x + dir.x][y + dir.y]) {
            if (this.scene.board[x + dir.x][y + dir.y].pieza === null) {
                this.scene.board[x + dir.x][y + dir.y].colorPossible();
            }
            else if (this.scene.board[x + dir.x][y + dir.y].pieza.equipo !== this.equipo) {
                this.scene.board[x + dir.x][y + dir.y].colorPossible();

            }
        }
    }
}
