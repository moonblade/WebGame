import { Engine, Loader, ILoadable } from 'excalibur';
import Player from './player';
import Resources from './resources';
import * as Phaser from 'phaser';
import { Dungeon } from './scenes/dungeon';

let gameConfig:GameConfig = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    scene: [Dungeon],
  }
class Game extends Phaser.Game{
    player: Player;
    constructor() {
        super(gameConfig);
    }
    
    onStart() {
        // this.tileResource = Resources.getInstance().getTiledResource("map");
        // this.add(this.tileResource.getTileMap());
        // this.player = new Player(this.tileResource);
        // this.add(this.player);
        // this.currentScene.camera.strategy.lockToActor(this.player);
    }
    
    loadAll(resources: ILoadable[]) {
        for (let resource of resources) {
            // this.load(resource);
        }
    }
    
    startWithLoader(){
        // this.start(Resources.getInstance().getLoader()).then(()=>this.onStart());
    }
    
}

export default Game;