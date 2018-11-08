import { Engine, ILoader, Promise } from 'excalibur';
import Player from './player';
import Rooms from './rooms';
class Game extends Engine{
    player: Player;
    rooms: Rooms;
    constructor() {
        super();
        this.initializeRooms();
        this.player = new Player();
        this.add(this.player);
    }
    
    startWithLoader(){
        this.start(this.player.loader);
    }
    
    initializeRooms() {
        this.rooms = new Rooms();
    }

}

export default Game;