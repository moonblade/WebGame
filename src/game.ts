import { Engine, Loader, ILoadable, Vector } from 'excalibur';
import Player from './player';
import Levels from './levels';
import Resources from './resources';
import { TiledResource } from './lib/tiled';
import Item from './item';

class Game extends Engine{
    player: Player;
    tileResource: TiledResource;
    rooms: Levels;
    constructor() {
        super();
        this.initializeRooms();
    }
    
    onStart() {
        // this.rooms = Levels.getInstance();
        this.tileResource = Resources.getInstance().getTiledResource("map");
        this.add(this.tileResource.getTileMap());
        this.player = new Player(this.tileResource);
        this.add(this.player);
        this.add(new Item('sword', new Vector(150, 500)));
        this.currentScene.camera.strategy.lockToActor(this.player);
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