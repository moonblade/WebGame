import { Engine, Loader, ILoadable } from 'excalibur';
import Player from './player';
import Levels from './levels';
import Resources from './resources';
class Game extends Engine{
    player: Player;
    rooms: Levels;
    constructor() {
        super();
        this.initializeRooms();
    }
    
    onStart() {
        this.player = new Player();
        this.rooms = Levels.getInstance();
        this.add(this.player);
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