import Tablero from '../Tablero.js';
import Casilla from '../Casilla.js';
import Player from '../Player.js';
import Pieza from '../Pieza.js';

export default class Fourdrez extends Phaser.Scene {

    constructor() {
        super({ key: 'fourdrez' })
    }

    preload() {
        this.players = [];
        // El tablero es 14x14 aunque haya casillas que no puedan usarse
        this.board = new Array(14);
        this.turn = (Number)(document.getElementById("turn").value);
        this.equiposEliminados = [];
        //Id del lobby al que juegas
        this.lobbyId = document.getElementById("lobbyId").value;
        this.team = document.getElementById("team").value;
        this.tabTeams = document.getElementById("tabTeams").value;
        this.tabTypes = document.getElementById("tabTypes").value;
        this.gameStarted = document.getElementById("gameStarted").value;

        this.isYourTurn = document.getElementById("isYourTurn");
    }

    create() {
        // Variables globales para saber que pieza se está moviendo
        this.movingPiece = false;
        this.pieceToMove = null;

        let x = 0;
        let y = 0;
        let size = this.sys.game.canvas.width;

        //Iniciamos el tablero
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(14);
        }

        new Tablero(this, x, y, size);

        const nPlayers = 4;
        const nPieces = 16;
        const offset = (nPlayers * nPieces);

        // Index de las piezas dentro del spriteMap (0 peon, 1 caballo, 2 torre, 3 alfil, 4 reina, 5 rey)
        const spriteMap = [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 3, 4, 5, 3, 1, 2];

        for (let i = 0; i < nPlayers; i++) {
            this.players[i] = new Player(this);
            for (let j = 0; j < nPieces; j++) {
                let sprite;

                // El iterador i es el jugador, j las 16 piezas que se van a crear
                if (i === 0) {
                    let x = (j % 8) + 3;
                    let y = j < 8 ? 12 : 13;
                    this.players[i].piezas[j] = new Pieza(this, this.add.sprite(offset + ((j % 8) * 18), (256 - 28) + (20 * (j < 8 ? 0 : 1)), "white_pieces", spriteMap[j]), j, i);
                    this.board[x][y].setPieza(this.players[i].piezas[j], x, y);
                }
                else if (i === 1) {
                    let x = (j < 8 ? 1 : 0);
                    let y = (j % 8) + 3;
                    this.players[i].piezas[j] = new Pieza(this, this.add.sprite(8 + (20 * (j < 8 ? 1 : 0)), offset + ((j % 8) * 18), "red_pieces", spriteMap[j]), j, i);
                    this.board[x][y].setPieza(this.players[i].piezas[j], x, y);
                }
                else if (i === 2) {
                    // Calculamos la posición de la pieza en el tablero
                    let x = (j % 8) + 3;
                    let y = j < 8 ? 1 : 0;
                    // Creamos nueva pieza y la metemos en el array de cada jugador
                    this.players[i].piezas[j] = new Pieza(this, this.add.sprite(offset + ((j % 8) * 18), 8 + (20 * (j < 8 ? 1 : 0)), "black_pieces", spriteMap[j]), j, i);
                    // Le decimos a la casilla sobre la que está, que contiene esta pieza
                    this.board[x][y].setPieza(this.players[i].piezas[j], x, y);
                }
                else if (i === 3) {
                    let x = (j < 8 ? 12 : 13);
                    let y = (j % 8) + 3;
                    this.players[i].piezas[j] = new Pieza(this, this.add.sprite((256 - 28) + (20 * (j < 8 ? 0 : 1)), offset + ((j % 8) * 18), "blue_pieces", spriteMap[j]), j, i);
                    this.board[x][y].setPieza(this.players[i].piezas[j], x, y);
                }
            }
        }

        if(this.turn === (Number)(this.team)){
            this.players[this.turn].interactPieces();
            this.isYourTurn.innerHTML = "¡Es tu turno!";
        }
        else this.isYourTurn.innerHTML = "No es tu turno :c";

        if(this.gameStarted === "true"){
            this.resetTablero();
        }

    }

    update() {

    }

    movePiece(type, team, x, y, newX, newY, turn) {
        this.board[x][y].pieza = null;
        this.board[newX][newY].movePieceTo(this.players[team].piezas[type]);
        this.players[this.turn].disablePieces();
        this.turn = turn;
        if(this.turn === (Number)(this.team)){
            this.players[this.turn].interactPieces();
            this.isYourTurn.innerHTML = "¡Es tu turno!";
        }
        else this.isYourTurn.innerHTML = "No es tu turno :c";
    }

    resetTablero(){
        // Poner todas las casillas con la pieza a null para colocar las nuevas
        this.board.forEach(element => {
            element.forEach(element2 => {
                element2.pieza = null;
            });
        });

        const arrayTeams = Array.from(this.tabTeams);
        const arrayTypes = Array.from(this.tabTypes);
        let spritesUsados = new Array();
        // Colocacion de las nuevas piezas
        for(let i = 0; i < this.board.length; ++i){
            for(let j = 0; j < this.board[i].length; ++j){
                if(arrayTeams[this.board.length * i + j] !== "e"){
                    let auxType = arrayTypes[this.board.length * i + j].charCodeAt(0) - "f".charCodeAt(0);
                    spritesUsados.push(this.players[(Number)(arrayTeams[this.board.length * i + j])].piezas[auxType].sprite);
                    this.board[j][i].movePieceTo(this.players[(Number)(arrayTeams[this.board.length * i + j])].piezas[auxType]);
                }
            }
        }

        this.turn = (Number)(document.getElementById("turn").value);

        // Los sprites que no se hayan usado es que estan muertos y se deben borrar
        this.players.forEach(player => {
            player.piezas.forEach(pieza =>{
                if(!spritesUsados.includes(pieza.sprite)){
                    pieza.sprite.destroy();
                    pieza.dead = true;  
                } 
            });
        });

        if(this.turn === (Number)(this.team))
            this.players[this.turn].interactPieces();
    }

    cheatsButton(id){
        this.scene.start("final", { won: id === (Number)(document.getElementById("id").value) });
    }
}