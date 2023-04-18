export default class Fourdrez extends Phaser.Scene {

    constructor() {
        super({ key: 'fourdrez' })
    }

    preload() {
        this.players = [];
        this.board = new Array(14);
        this.turn = 0;
    }

    create() {
        this.movingPiece = false;
        this.pieceToMove = null;

        let x = 0;
        let y = 0;
        let size = this.sys.game.canvas.width;
        let sizeFicha = 16;

        for(let i = 0; i < this.board.length; i++){
            this.board[i] = new Array(14);
        }

        new Tablero(this, x, y, size);

        const nPlayers = 4;
        const nPieces = 16;
        const offset = (nPlayers * nPieces);

        const spriteMap = [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 3, 4, 5, 3, 1, 2];

        for (let i = 0; i < nPlayers; i++) {
            this.players[i] = new Player(this);
            for (let j = 0; j < nPieces; j++) {
                let sprite;

                if (i === 2){
                    let x = (j % 8) + 3;
                    let y = j < 8 ? 1 : 0;
                    this.players[i].piezas[j] = new Pieza(this, this.add.sprite(offset + ((j % 8) * 18), 8 + (20 * (j < 8 ? 1 : 0)), "black_pieces", spriteMap[j]), j, i);
                    this.board[x][y].setPieza(this.players[i].piezas[j],x,y);
                }
                else if (i === 0){
                    let x = (j % 8) + 3;
                    let y = j < 8 ? 12 : 13;
                    this.players[i].piezas[j] = new Pieza(this, this.add.sprite(offset + ((j % 8) * 18), (256 - 28) + (20 * (j < 8 ? 0 : 1)), "white_pieces", spriteMap[j]), j, i);
                    this.board[x][y].setPieza(this.players[i].piezas[j],x,y);
                }
                else if (i === 1){
                    let x = (j < 8 ? 1 : 0);
                    let y = (j % 8) + 3;
                    this.players[i].piezas[j] = new Pieza(this, this.add.sprite(8 + (20 * (j < 8 ? 1 : 0)), offset + ((j % 8) * 18), "red_pieces", spriteMap[j]), j, i);
                    this.board[x][y].setPieza(this.players[i].piezas[j],x,y);
                }
                else if (i === 3){
                    let x = (j < 8 ? 12 : 13);
                    let y = (j % 8) + 3;
                    this.players[i].piezas[j] = new Pieza(this, this.add.sprite((256 - 28) + (20 * (j < 8 ? 0 : 1)), offset + ((j % 8) * 18), "blue_pieces", spriteMap[j]), j, i);
                    this.board[x][y].setPieza(this.players[i].piezas[j],x,y);
                }
            }
        }

        this.players[this.turn].interactPieces();

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
        

        //La parte del centro (El rectangulo)
        for (let j = 0; j < this.columnas; j++) {
            this.changeColor(white, black);
            for (let i = 3; i < this.filas - 3; i++) {
                this.changeColor(white, black);
                this.scene.board[i][j] = new Casilla(this.scene, i * this.sizeFila + this.x, j * this.sizeColumna + this.y, this.sizeFila, this.sizeColumna, this.color, i, j);
            }
        }

        for (let j = 3; j < this.columnas - 3; j++) {
            for (let i = 0; i < 3; i++) {
                this.scene.board[i][j] = new Casilla(this.scene, i * this.sizeFila + this.x, j * this.sizeColumna + this.y, this.sizeFila, this.sizeColumna, this.color, i, j);
                this.changeColor(white, black);
            }
        }

        this.changeColor(white, black);

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

class Casilla extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, fillColor, tabX, tabY) {
        super(scene, x, y, width, height, fillColor);
        scene.add.existing(this);
        this.setOrigin(0, 0);
        this.pieza = null;
        this.originalColor = fillColor;

        this.possible = false;

        this.xTablero = tabX;
        this.yTablero = tabY;

        this.setInteractive();
        this.on('pointerdown', (pointer) => {
            if(this.possible){
                if(scene.players[scene.turn].movingPiece){
                    scene.players[scene.turn].disablePieces();
                    if(this.pieza !== null){
                        this.pieza.sprite.destroy();
                        this.pieza = scene.players[scene.turn].pieceToMove;
                    }
                    else{
                        this.pieza = scene.players[scene.turn].pieceToMove;
                    }
    
                    scene.players[scene.turn].pieceToMove.sprite.x = x + 8;
                    scene.players[scene.turn].pieceToMove.sprite.y = y + 8;
                    scene.players[scene.turn].movingPiece = false;
    
                    if(scene.turn + 1 > 3) scene.turn = 0;
                    else scene.turn++;

                    this.pieza.tableroX = this.xTablero;
                    this.pieza.tableroY = this.yTablero;
    
                    scene.players[scene.turn].interactPieces();
                }
            }
            
        });

        this.on('pointerover', (pointer) => {
            if(scene.players[scene.turn].movingPiece){
                this.fillColor = 0x6a6a6a;
            }
        });

        this.on('pointerout', (pointer) => {
            this.fillColor = this.originalColor;
        });
    }

    colorPossible(){
        this.possible = true;
        this.fillColor = 0x6a6a6a;
    }

    colorReset(){
        this.fillColor = this.originalColor;
    }

    setPieza(p, x, y){
        this.pieza = p;
        this.pieza.tableroX = x;
        this.pieza.tableroY = y;
    }
}

class Player{
    constructor(scene){
        this.scene = scene;
        this.movingPiece = false;
        this.pieceToMove = null;
        this.piezas = new Array(16);
    }

    interactPieces(){
        for(let i of this.piezas){
            if(i.sprite && i.sprite.active && i.sprite.visible)
                i.sprite.setInteractive();
        }
    }

    disablePieces(){
        for(let i of this.piezas){
            if(i.sprite && i.sprite.active && i.sprite.visible)
                i.sprite.disableInteractive();
        }
    }
}

class Pieza{
    constructor(scene, s, t, e){
        this.scene = scene;
        this.tipo = t;
        this.equipo = e;

        this.tableroX;
        this.tableroY;

        this.sprite = s;
        this.sprite.setInteractive();

        this.sprite.on('pointerdown', (pointer) => {
            if(!scene.players[scene.turn].movingPiece){
                scene.players[scene.turn].movingPiece = true;
                scene.players[scene.turn].pieceToMove = this;

                scene.board[this.tableroX][this.tableroY].pieza = null;

                //Si eres el equipo blanco
                if(scene.turn === 0){
                    //Si es un peon...
                    if(this.tipo < 8){
                        if(scene.board[this.tableroX][this.tableroY -1].pieza === null){
                            if(this.tableroY === 12){
                                scene.board[this.tableroX][this.tableroY -1].colorPossible();
                                if(scene.board[this.tableroX][this.tableroY -2].pieza === null)
                                    scene.board[this.tableroX][this.tableroY -2].colorPossible();
                            }
                            else{
                                scene.board[this.tableroX][this.tableroY -1].colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if(scene.board[this.tableroX-1][this.tableroY -1].pieza !== null){
                            scene.board[this.tableroX - 1][this.tableroY -1].colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if(scene.board[this.tableroX+1][this.tableroY -1].pieza !== null){
                            scene.board[this.tableroX+1][this.tableroY -1].colorPossible();
                        }
                    }
                }
                // Si eres el equipo rojo
                else if(scene.turn === 1){
                    //Si es un peon...
                    if(this.tipo < 8){
                        if(scene.board[this.tableroX+1][this.tableroY].pieza === null){
                            if(this.tableroX === 1){
                                scene.board[this.tableroX+1][this.tableroY].colorPossible();
                                if(scene.board[this.tableroX+2][this.tableroY].pieza === null)
                                    scene.board[this.tableroX+2][this.tableroY].colorPossible();
                            }
                            else{
                                scene.board[this.tableroX+1][this.tableroY].colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if(scene.board[this.tableroX+1][this.tableroY -1].pieza !== null){
                            scene.board[this.tableroX+1][this.tableroY -1].colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if(scene.board[this.tableroX+1][this.tableroY +1].pieza !== null){
                            scene.board[this.tableroX+1][this.tableroY +1].colorPossible();
                        }
                    }
                    
                }
                // Si eres el equipo negro
                else if(scene.turn === 2){
                    //Si es un peon...
                    if(this.tipo<8){
                        if(scene.board[this.tableroX][this.tableroY +1].pieza === null){
                            if(this.tableroY === 1){
                                scene.board[this.tableroX][this.tableroY +1].colorPossible();
                                if(scene.board[this.tableroX][this.tableroY +2].pieza === null)
                                    scene.board[this.tableroX][this.tableroY +2].colorPossible();
                            }
                            else{
                                scene.board[this.tableroX][this.tableroY +1].colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if(scene.board[this.tableroX-1][this.tableroY +1].pieza !== null){
                            scene.board[this.tableroX - 1][this.tableroY +1].colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if(scene.board[this.tableroX+1][this.tableroY +1].pieza !== null){
                            scene.board[this.tableroX+1][this.tableroY +1].colorPossible();
                        }
                    }
                    
                }
                // Si eres el equipo azul
                else if(scene.turn === 3){
                    //Si es un peon...
                    if(this.tipo < 8){
                        if(scene.board[this.tableroX-1][this.tableroY].pieza === null){
                            if(this.tableroX === 12){
                                scene.board[this.tableroX-1][this.tableroY].colorPossible();
                                if(scene.board[this.tableroX-2][this.tableroY].pieza === null)
                                    scene.board[this.tableroX-2][this.tableroY].colorPossible();
                            }
                            else{
                                scene.board[this.tableroX-1][this.tableroY].colorPossible();
                            }
                        }
                        //Para comer la pieza de la izquierda
                        if(scene.board[this.tableroX-1][this.tableroY -1].pieza !== null){
                            scene.board[this.tableroX-1][this.tableroY -1].colorPossible();
                        }
                        //Para comer la pieza de la derecha
                        if(scene.board[this.tableroX-1][this.tableroY +1].pieza !== null){
                            scene.board[this.tableroX-1][this.tableroY +1].colorPossible();
                        }
                    }
                }
            }
            
        }).disableInteractive();

        this.sprite.on('pointerover', (pointer) => {
            this.sprite.setScale(1.5);
            this.sprite.setDepth(1);
            
        }).disableInteractive();

        this.sprite.on('pointerout', (pointer) => {
            this.sprite.setScale(1);
        }).disableInteractive();
    }
}
