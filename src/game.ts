import { Engine, ILoadable } from 'excalibur';
import Levels from './levels';
import { TiledResource } from './lib/tiled';
import Player from './player';
import Resources from './resources';

class Game extends Engine{
    player: Player;
    tileResource: TiledResource;
    rooms: Levels;
    static instance: Game = null;
    
    static getInstance() {
        if (Game.instance == null)
            Game.instance = new Game();
        return Game.instance;
    }

    constructor() {
        super();
        this.initializeRooms();
    }
    
    onStart() {
        Resources.getInstance().onInitialize(this);
        this.tileResource = Resources.getInstance().getTiledResource("map");
        this.add(this.tileResource.getTileMap());
        this.player = Player.getInstance();
        this.add(this.player);
        this.currentScene.camera.strategy.lockToActor(this.player);
        this.currentScene.camera.zoom(2);
        // this.isDebug = true;
    }
    
    loadAll(resources: ILoadable[]) {
        for (let resource of resources) {
            this.load(resource);
        }
    }
    
    startWithLoader(){
        this.start(Resources.getInstance().getLoader()).then(()=>this.onStart());
    }
    
    initializeRooms() {
        this.rooms = new Levels();
    }

}

export default Game;