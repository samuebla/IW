import boot from './scenes/boot.js';
import fourdrez from './scenes/fourdrez.js';
import final from './scenes/final.js';

let config = {
    type: Phaser.CANVAS,
    canvas: document.getElementById("juego"),
    width: 256,
    height: 256,
    backgroundColor: "#dadaad",
    scale: {
        mode: Phaser.Scale.FIT,
    },
    pixelArt: true,
    scene: [boot, fourdrez, final]
};

// cambio 1: hacer game visible
const game = new Phaser.Game(config);