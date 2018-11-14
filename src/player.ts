import { Actor, Engine, Color, Texture, Sprite } from 'excalibur';
import Resources from './resources';
class Player extends Actor {
    health: number;
    speed: number;
    sprite: Sprite;

    constructor() {
        super(30,30,30,30);
        this.color = Color.Red;
        this.speed = 600;
    }
    
    clicked(coordinates:any) {
        // Move the player to coordinate
        this.actions.clearActions();
        this.actions.moveTo(coordinates.x, coordinates.y, this.speed);
    }

    public onInitialize(engine: Engine) {
        this.sprite = new Sprite(Resources.getInstance().walkTexture, 7, 8, 14, 21);
        this.addDrawing(this.sprite)
        this.enableCapturePointer = true;
        // respond to click events
        engine.input.pointers.primary.on('down', (event:any)=>{
            this.clicked(event.coordinates.worldPos);
        })
    }

}

export default Player;