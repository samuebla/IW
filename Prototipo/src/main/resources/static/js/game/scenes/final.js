export default class Final extends Phaser.Scene {

    constructor() {
        super({ key: 'final' })
    }

    create(data) {
        this.scale.resize(700,700);
        if(data.won){
            this.add.sprite(350,350,"victoria");
        }
        else{
            this.add.sprite(350,350,"derrota");
        }

    }
}