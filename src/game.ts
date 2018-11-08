import { Engine } from 'excalibur';
import Player from './player';
class Game extends Engine{
    player: Player;
    constructor() {
        super();

        this.player = new Player();
        this.add(this.player);
    }

}

export default Game;