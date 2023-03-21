//Configuracioón del juego de Phaser
let config = {
    type: Phaser.CANVAS,
    canvas: document.getElementById("juego"),
    width: 1280,
    height: 720,
    backgroundColor: "#dadaad",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    scene: []
};

new Phaser.Game(config);