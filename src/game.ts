import * as ex from 'excalibur';
class Game {
    game: ex.Engine;
    constructor() {
        this.game = new ex.Engine({
            width: 800,
            height: 600
        });

        var paddle = new ex.Actor(150, this.game.drawHeight - 40, 200, 20)

paddle.color = ex.Color.Chartreuse

// Make sure the paddle can partipate in collisions, by default excalibur actors do not collide
paddle.collisionType = ex.CollisionType.Fixed

// `game.add` is the same as calling
// `game.currentScene.add`
this.game.add(paddle)

    }

    start() {
        this.game.start()
    }
}

export default Game;