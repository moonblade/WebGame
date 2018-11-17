import { Engine, Loader, ILoadable } from 'excalibur';
import Player from './player';
import Rooms from './rooms';
import Resources from './resources';
class Game extends Engine{
    player: Player;
    rooms: Rooms;
    constructor() {
        super();
        this.initializeRooms();
    }
    
    onStart() {
        this.player = new Player();
        this.rooms = Rooms.getInstance();
        this.add(this.player);
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
        this.rooms = new Rooms();
    }

}

export default Game;