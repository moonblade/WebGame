import { Engine, Loader, ILoadable, Vector, Debug } from 'excalibur';
import Player from './player';
import Levels from './levels';
import Resources from './resources';
import { TiledResource } from './lib/tiled';
import Item from './item';

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