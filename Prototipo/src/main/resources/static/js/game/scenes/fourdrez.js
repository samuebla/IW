export default class Fourdrez extends Phaser.Scene {

    constructor() {
        super({ key: 'fourdrez' })
    }

    preload() {
        this.players = [];
        this.board = [];
    }

    create() {
        new Tablero(this, 50, 75, 100);
        /*    this.add.sprite(128, 128, "board");

            const nPlayers = 4;
            const nPieces = 16;
            const offset = (4 * 16) + 8;

            for (let i = 0; i < nPlayers; i++) {
                for (let j = 0; j < nPieces; j++) {
                    let sprite;
                    if (i === 0) {
                        if (j < nPieces / 2) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 38, "black_pieces", 0);
                        }
                        else if (j === 8 || j === 15) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 23, "black_pieces", 2);
                        }
                        else if (j === 9 || j === 14) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 23, "black_pieces", 1);
                        }
                        else if (j === 10 || j === 13) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 23, "black_pieces", 3);
                        }
                        else if (j === 11) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 23, "black_pieces", 4);
                        }
                        else if (j === 12) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 23, "black_pieces", 5);
                        }

                    }
                    else if (i === 1) {
                        if (j < nPieces / 2) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 256 - 41, "white_pieces", 0);
                        }
                        else if (j === 8 || j === 15) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 256 - 24, "white_pieces", 2);
                        }
                        else if (j === 9 || j === 14) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 256 - 24, "white_pieces", 1);
                        }
                        else if (j === 10 || j === 13) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 256 - 24, "white_pieces", 3);
                        }
                        else if (j === 11) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 256 - 24, "white_pieces", 4);
                        }
                        else if (j === 12) {
                            sprite = this.add.sprite(offset + ((j % 8) * 16), 256 - 24, "white_pieces", 5);
                        }
                    }
                    else if (i === 2) {
                        if (j < nPieces / 2) {
                            sprite = this.add.sprite(40, offset + ((j % 8) * 16), "red_pieces", 0);
                        }
                        else if (j === 8 || j === 15) {
                            sprite = this.add.sprite(24, offset + ((j % 8) * 16), "red_pieces", 2);
                        }
                        else if (j === 9 || j === 14) {
                            sprite = this.add.sprite(24, offset + ((j % 8) * 16), "red_pieces", 1);
                        }
                        else if (j === 10 || j === 13) {
                            sprite = this.add.sprite(24, offset + ((j % 8) * 16), "red_pieces", 3);
                        }
                        else if (j === 11) {
                            sprite = this.add.sprite(24, offset + ((j % 8) * 16), "red_pieces", 4);
                        }
                        else if (j === 12) {
                            sprite = this.add.sprite(24, offset + ((j % 8) * 16), "red_pieces", 5);
                        }
                    }
                    else if (i === 3) {
                        if (j < nPieces / 2) {
                            sprite = this.add.sprite(256 - 41, offset + ((j % 8) * 16), "blue_pieces", 0);
                        }
                        else if (j === 8 || j === 15) {
                            sprite = this.add.sprite(256 - 24, offset + ((j % 8) * 16), "blue_pieces", 2);
                        }
                        else if (j === 9 || j === 14) {
                            sprite = this.add.sprite(256 - 24, offset + ((j % 8) * 16), "blue_pieces", 1);
                        }
                        else if (j === 10 || j === 13) {
                            sprite = this.add.sprite(256 - 24, offset + ((j % 8) * 16), "blue_pieces", 3);
                        }
                        else if (j === 11) {
                            sprite = this.add.sprite(256 - 24, offset + ((j % 8) * 16), "blue_pieces", 4);
                        }
                        else if (j === 12) {
                            sprite = this.add.sprite(256 - 24, offset + ((j % 8) * 16), "blue_pieces", 5);
                        }
                    }

                    sprite.setInteractive();
                    sprite.on('pointerdown', function (pointer) {
                        console.log("Clicked");
                    });

                    sprite.on('pointerover', function (pointer) {
                        sprite.setScale(1.5);
                        //sprite.setDepth(1);
                    });

                    sprite.on('pointerout', function (pointer) {
                        sprite.setScale(1);
                    });
                }
            }

        }

        update() {

         }*/
    }

}

class Tablero {
    constructor(scene, x, y, size) {
        this.scene = scene;

        this.x = x;
        this.y = y;
        this.size = size;
        this.filas = 14;
        this.columnas = 14;

        this.createTablero();
    }

    createTablero() {
        let sizeFila = this.size / this.filas;
        let sizeColumna = this.size / this.columnas;
        let black = 0x000000;
        let white = 0xffffff;
        this.color = white;

        for (let j = 0; j < this.columnas; j++) {
            this.changeColor(white, black);
            for (let i = 3; i < this.filas - 3; i++) {
                this.changeColor(white, black);
                new Casilla(this.scene, i * sizeFila + this.x, j * sizeColumna + this.y, sizeFila, sizeColumna, this.color);
            }
        }

        for (let j = 3; j < this.columnas - 3; j++) {
            for (let i = 0; i < 3; i++) {
                new Casilla(this.scene, i * sizeFila + this.x, j * sizeColumna + this.y, sizeFila, sizeColumna, this.color);
                this.changeColor(white, black);
            }
        }

        this.changeColor(white, black);

        for (let j = 3; j < this.columnas - 3; j++) {
            for (let i = this.filas - 3; i < this.filas; i++) {
                new Casilla(this.scene, i * sizeFila + this.x, j * sizeColumna + this.y, sizeFila, sizeColumna, this.color);
                this.changeColor(white, black);
            }
        }

    }

    changeColor(white, black) {
        this.color = this.color === black ? white : black;
    }
}

class Casilla extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, fillColor) {
        super(scene, x, y, width, height, fillColor);
        scene.add.existing(this);
        this.setOrigin(0, 0);
    }
}
