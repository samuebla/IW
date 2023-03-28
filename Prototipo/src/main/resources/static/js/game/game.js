import boot from './scenes/boot.js';
import fourdrez from './scenes/fourdrez.js';

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
    scene: [boot, fourdrez]
};

new Phaser.Game(config);