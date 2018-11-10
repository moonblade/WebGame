import { Actor, Engine, Color, Texture, Sprite } from 'excalibur';
import Resources from './resources';
class Player extends Actor {
    health: number;
    sprite: Sprite;

    constructor() {
        super(30,30,30,30);
        this.color = Color.Red;
    }
    
    public onInitialize(engine: Engine) {
        this.sprite = new Sprite(Resources.getInstance().walkTexture, 0, 0, 120, 120);
        this.addDrawing(this.sprite)
    }

}

export default Player;