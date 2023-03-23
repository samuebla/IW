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

        this.load.image("board", "board.png");
    }

    create() {
        this.scene.start("fourdrez");
    }
}