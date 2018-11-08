import * as ex from 'excalibur';
import Player from './player';
class Game {
    game: ex.Engine;
    player: Player;
    constructor() {
        this.game = new ex.Engine();

        this.player = new Player();
        this.game.add(this.player);
    }

    start() {
        this.game.start()
    }
}

export default Game;