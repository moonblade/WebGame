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
        // this.rooms = Levels.getInstance();
        this.tileResource = Resources.getInstance().getTiledResource("map");
        this.add(this.tileResource.getTileMap());
        this.player = Player.getInstance();
        this.add(this.player);
        this.add(new Item('sword', new Vector(150, 500)));
        // let sw:Item = new Item('sword', new Vector(100, 500));
        // sw.actions.moveTo(160, 500,50)
        // sw.actions.moveTo(100, 500,50)
        // sw.actions.repeatForever();
        // this.add(sw)
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