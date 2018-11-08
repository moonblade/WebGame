import { Actor, Engine, Color, Texture, Sprite, Loader } from 'excalibur';
class Player extends Actor {
    health: number;
    texture: Texture;
    sprite: Sprite;
    loader: Loader;

    constructor() {
        super(30,30,30,30);
        this.color = Color.Red;
        this.texture = new Texture('./src/resources/walk_sprite.png');
        this.sprite = new Sprite(this.texture, 0, 0, 120, 120);
        this.loader = new Loader([this.texture]);
    }
    
    public onInitialize(engine: Engine) {
        this.addDrawing(this.sprite)
    }

}

export default Player;