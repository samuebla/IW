export default class Fourdrez extends Phaser.Scene {

    constructor() {
        super({ key: 'fourdrez' })
    }

    preload() {
        this.players = [];
        this.board = [];
    }

    create() {
        this.movingPiece = false;
        this.pieceToMove = null;

        let x = 0;
        let y = 0;
        let size = this.sys.game.canvas.width;
        let sizeFicha = 16;

        new Tablero(this, x, y, size);

        const nPlayers = 4;
        const nPieces = 16;
        const offset = (nPlayers * nPieces);

        const spriteMap = [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 3, 4, 5, 3, 1, 2];

        for (let i = 0; i < nPlayers; i++) {
            this.players[i] = new Player(this);
            for (let j = 0; j < nPieces; j++) {
                let sprite;

                if (i === 0)
                    sprite = this.add.sprite(offset + ((j % 8) * 18), 8 + (20 * (j < 8 ? 1 : 0)), "black_pieces", spriteMap[j]);

                else if (i === 1)
                    sprite = this.add.sprite(offset + ((j % 8) * 18), (256 - 28) + (20 * (j < 8 ? 0 : 1)), "white_pieces", spriteMap[j]);

                else if (i === 2)
                    sprite = this.add.sprite(8 + (20 * (j < 8 ? 1 : 0)), offset + ((j % 8) * 18), "red_pieces", spriteMap[j]);

                else if (i === 3)
                    sprite = this.add.sprite((256 - 28) + (20 * (j < 8 ? 0 : 1)), offset + ((j % 8) * 18), "blue_pieces", spriteMap[j]);


                sprite.setInteractive();

                //sprite.setScale()
                sprite.on('pointerdown', (pointer) => {
                    if(!this.players[0].movingPiece){
                        this.players[0].movingPiece = true;
                        this.players[0].pieceToMove = sprite;
                    }
                });

                sprite.on('pointerover', (pointer) => {
                    sprite.setScale(1.5);
                    sprite.setDepth(1);
                });

                sprite.on('pointerout', (pointer) => {
                    sprite.setScale(1);
                });
            }
        }

    }

    update() {

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
        this.sizeFila = this.size / this.filas;
        this.sizeColumna = this.size / this.columnas;
        this.color = 0xffffff;

        this.createTablero();
    }

    createTablero() {
        let black = 0x000000;
        let white = 0xffffff;
        

        for (let j = 0; j < this.columnas; j++) {
            this.changeColor(white, black);
            for (let i = 3; i < this.filas - 3; i++) {
                this.changeColor(white, black);
                new Casilla(this.scene, i * this.sizeFila + this.x, j * this.sizeColumna + this.y, this.sizeFila, this.sizeColumna, this.color);
            }
        }

        for (let j = 3; j < this.columnas - 3; j++) {
            for (let i = 0; i < 3; i++) {
                new Casilla(this.scene, i * this.sizeFila + this.x, j * this.sizeColumna + this.y, this.sizeFila, this.sizeColumna, this.color);
                this.changeColor(white, black);
            }
        }

        this.changeColor(white, black);

        for (let j = 3; j < this.columnas - 3; j++) {
            for (let i = this.filas - 3; i < this.filas; i++) {
                new Casilla(this.scene, i * this.sizeFila + this.x, j * this.sizeColumna + this.y, this.sizeFila, this.sizeColumna, this.color);
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

        this.setInteractive();
        this.on('pointerdown', (pointer) => {
            if(scene.players[0].movingPiece){
                scene.players[0].pieceToMove.x = x + 8;
                scene.players[0].pieceToMove.y = y + 8;
                scene.players[0].movingPiece = false;
            }
        });

        this.on('pointerover', (pointer) => {
            this.fillColor = 0x6a6a6a;
        });

        this.on('pointerout', (pointer) => {
            this.fillColor = fillColor;
        });
    }
}

class Player{
    constructor(scene){
        this.scene = scene;
        this.movingPiece = false;
        this.pieceToMove = null;
    }
}
