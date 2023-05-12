export default class Boot extends Phaser.Scene {

    constructor() {
        super({ key: "boot" });
    }

    //carga de assets
    preload() {
        this.load.setPath('/assets/');

        this.load.spritesheet("black_pieces", "black_pieces.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("white_pieces", "white_pieces.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("blue_pieces", "blue_pieces.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("red_pieces", "red_pieces.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.image("board", "board.png");

        this.load.image("victoria", "victoria.png");
        this.load.image("derrota", "derrota.png");
    }

    create() {
        this.scene.start("fourdrez");
    }
}