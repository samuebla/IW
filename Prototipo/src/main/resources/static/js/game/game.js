//Configuracioón del juego de Phaser

let config = {
    type: Phaser.CANVAS,
    canvas: document.getElementById("juego"),
    width: 1000,
    height: 1000,
    backgroundColor: "#dadaad",
    scale: {
        mode: Phaser.Scale.FIT,
    },
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

new Phaser.Game(config);

function preload() {
    this.load.setPath('/assets/');
    this.load.spritesheet("Black", "BlackPieces.png", {
        frameWidth: 16,
        frameHeight: 16
    });
    this.load.image("Board", "board_plain_01.png");
}

function create() {
    this.add.sprite(100, 100, "Board");


    this.add.sprite(100, 100, "Black", 0)
        .setScale(2);

}

function update() { }