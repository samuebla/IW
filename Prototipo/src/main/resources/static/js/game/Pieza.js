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
            if (!scene.players[scene.turn].movingPiece) {
                scene.players[scene.turn].movingPiece = true;
                scene.players[scene.turn].pieceToMove = this;

                scene.board[this.tableroX][this.tableroY].pieza = null;

                //Si eres el equipo blanco
                if (scene.turn === 0) {
                    console.log(this.tipo);
                    //Si es un peon...
                    if (this.tipo < 8) {
                        // Casilla arribIzq = scene.board[this.tableroX - 1][this.tableroY - 1];
                        // Se calculan las casillas a las que puede avanzar la pieza y se llama al tablero para que las cambie de color
                        // Además cada casilla tiene un booleano para saber si es válida o no, la gestión de mover la pieza se da en la clase casilla
                        if (scene.board[this.tableroX][this.tableroY - 1] && scene.board[this.tableroX][this.tableroY - 1].pieza === null) {
                            if (this.tableroY === 12) {
                                scene.board[this.tableroX][this.tableroY - 1].colorPossible();
                                if (scene.board[this.tableroX][this.tableroY - 2] && scene.board[this.tableroX][this.tableroY - 2].pieza === null)
                                    scene.board[this.tableroX][this.tableroY - 2].colorPossible();
                            }
                            else {
                                scene.board[this.tableroX][this.tableroY - 1].colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if (scene.board[this.tableroX - 1][this.tableroY - 1] && scene.board[this.tableroX - 1][this.tableroY - 1].pieza !== null) {
                            if (scene.board[this.tableroX - 1][this.tableroY - 1].pieza.equipo !== this.equipo)
                                scene.board[this.tableroX - 1][this.tableroY - 1].colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if (scene.board[this.tableroX + 1][this.tableroY - 1] && scene.board[this.tableroX + 1][this.tableroY - 1].pieza !== null) {
                            if (scene.board[this.tableroX + 1][this.tableroY - 1].pieza.equipo !== this.equipo)
                                scene.board[this.tableroX + 1][this.tableroY - 1].colorPossible();
                        }
                    }
                    // Si es una torre...
                    else if (this.tipo === 8 || this.tipo === 15) {
                        // Calcula las 4 direcciones
                        this.casillaRecursiva({ x: 0, y: 1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 0, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 1, y: 0 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: 0 }, this.tableroX, this.tableroY);

                    }
                    //Si es un alfil...
                    else if (this.tipo === 10 || this.tipo === 13) {
                        // Calcula las 4 direcciones
                        this.casillaRecursiva({ x: 1, y: 1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 1, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: 1 }, this.tableroX, this.tableroY);

                    }
                    // Si es una reina...
                    //else if (this.tipo === )
                }
                // Si eres el equipo rojo
                else if (scene.turn === 1) {
                    //Si es un peon...
                    if (this.tipo < 8) {
                        if (scene.board[this.tableroX + 1][this.tableroY] && scene.board[this.tableroX + 1][this.tableroY].pieza === null) {
                            if (this.tableroX === 1) {
                                scene.board[this.tableroX + 1][this.tableroY].colorPossible();
                                if (scene.board[this.tableroX + 2][this.tableroY] && scene.board[this.tableroX + 2][this.tableroY].pieza === null)
                                    scene.board[this.tableroX + 2][this.tableroY].colorPossible();
                            }
                            else {
                                scene.board[this.tableroX + 1][this.tableroY].colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if (scene.board[this.tableroX + 1][this.tableroY - 1] && scene.board[this.tableroX + 1][this.tableroY - 1].pieza !== null) {
                            if (scene.board[this.tableroX + 1][this.tableroY - 1].pieza.equipo !== this.equipo)
                                scene.board[this.tableroX + 1][this.tableroY - 1].colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if (scene.board[this.tableroX + 1][this.tableroY + 1] && scene.board[this.tableroX + 1][this.tableroY + 1].pieza !== null) {
                            if (scene.board[this.tableroX + 1][this.tableroY + 1].pieza.equipo !== this.equipo)
                                scene.board[this.tableroX + 1][this.tableroY + 1].colorPossible();
                        }
                    }
                    // Si es una torre...
                    else if (this.tipo === 8 || this.tipo === 15) {
                        // Calcula las 4 direcciones
                        this.casillaRecursiva({ x: 0, y: 1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 0, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 1, y: 0 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: 0 }, this.tableroX, this.tableroY);

                    }
                    //Si es un alfil...
                    else if (this.tipo === 10 || this.tipo === 13) {
                        // Calcula las 4 direcciones
                        this.casillaRecursiva({ x: 1, y: 1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 1, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: 1 }, this.tableroX, this.tableroY);

                    }

                }
                // Si eres el equipo negro
                else if (scene.turn === 2) {
                    //Si es un peon...
                    if (this.tipo < 8) {
                        if (scene.board[this.tableroX][this.tableroY + 1] && scene.board[this.tableroX][this.tableroY + 1].pieza === null) {
                            if (this.tableroY === 1) {
                                scene.board[this.tableroX][this.tableroY + 1].colorPossible();
                                if (scene.board[this.tableroX][this.tableroY + 2] && scene.board[this.tableroX][this.tableroY + 2].pieza === null)
                                    scene.board[this.tableroX][this.tableroY + 2].colorPossible();
                            }
                            else {
                                scene.board[this.tableroX][this.tableroY + 1].colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if (scene.board[this.tableroX - 1][this.tableroY + 1] && scene.board[this.tableroX - 1][this.tableroY + 1].pieza !== null) {
                            if (scene.board[this.tableroX - 1][this.tableroY + 1].pieza.equipo !== this.equipo)
                                scene.board[this.tableroX - 1][this.tableroY + 1].colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if (scene.board[this.tableroX + 1][this.tableroY + 1] && scene.board[this.tableroX + 1][this.tableroY + 1].pieza !== null) {
                            if (scene.board[this.tableroX + 1][this.tableroY + 1].pieza.equipo !== this.equipo)
                                scene.board[this.tableroX + 1][this.tableroY + 1].colorPossible();
                        }
                    }
                    // Si es una torre...
                    else if (this.tipo === 8 || this.tipo === 15) {
                        // Calcula las 4 direcciones
                        this.casillaRecursiva({ x: 0, y: 1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 0, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 1, y: 0 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: 0 }, this.tableroX, this.tableroY);

                    }
                    //Si es un alfil...
                    else if (this.tipo === 10 || this.tipo === 13) {
                        // Calcula las 4 direcciones
                        this.casillaRecursiva({ x: 1, y: 1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 1, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: 1 }, this.tableroX, this.tableroY);

                    }

                }
                // Si eres el equipo azul
                else if (scene.turn === 3) {
                    //Si es un peon...
                    if (this.tipo < 8) {
                        if (scene.board[this.tableroX - 1][this.tableroY] && scene.board[this.tableroX - 1][this.tableroY].pieza === null) {
                            if (this.tableroX === 12) {
                                scene.board[this.tableroX - 1][this.tableroY].colorPossible();
                                if (scene.board[this.tableroX - 2][this.tableroY] && scene.board[this.tableroX - 2][this.tableroY].pieza === null)
                                    scene.board[this.tableroX - 2][this.tableroY].colorPossible();
                            }
                            else {
                                scene.board[this.tableroX - 1][this.tableroY].colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if (scene.board[this.tableroX - 1][this.tableroY - 1] && scene.board[this.tableroX - 1][this.tableroY - 1].pieza !== null) {
                            if (scene.board[this.tableroX - 1][this.tableroY - 1].pieza.equipo !== this.equipo)
                                scene.board[this.tableroX - 1][this.tableroY - 1].colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if (scene.board[this.tableroX - 1][this.tableroY + 1] && scene.board[this.tableroX - 1][this.tableroY + 1].pieza !== null) {
                            if (scene.board[this.tableroX - 1][this.tableroY + 1].pieza.equipo !== this.equipo)
                                scene.board[this.tableroX - 1][this.tableroY + 1].colorPossible();
                        }
                    }
                    // Si es una torre...
                    else if (this.tipo === 8 || this.tipo === 15) {
                        // Calcula las 4 direcciones
                        this.casillaRecursiva({ x: 0, y: 1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 0, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 1, y: 0 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: 0 }, this.tableroX, this.tableroY);

                    }
                    //Si es un alfil...
                    else if (this.tipo === 10 || this.tipo === 13) {
                        // Calcula las 4 direcciones
                        this.casillaRecursiva({ x: 1, y: 1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: 1, y: -1 }, this.tableroX, this.tableroY);
                        this.casillaRecursiva({ x: -1, y: 1 }, this.tableroX, this.tableroY);

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
}
