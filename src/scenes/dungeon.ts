import * as graphics from '../resources/graphics.json';
import Player from '../player';
export class Dungeon extends Phaser.Scene {
    player: Player;
    constructor() {
        super({
            key: 'dungeon'
        })
    }
    
    preload(): void {
        this.player = new Player(this);
    }

    create(): void {
        this.add.sprite(this.player);
    }
}