export default class Fourdrez extends Phaser.Scene {

    constructor() {
        super({ key: 'fourdrez' })
    }

    preload() {
        this.players = [];
        this.board = [];
    }

    create() {
        this.add.sprite(100, 100, "board");


        this.add.sprite(100, 100, "black_pieces", 0)
            .setScale(2);
    }

    update() {

    }
}