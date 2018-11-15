import { Actor, Engine, Color, Texture, Sprite, Vector, SpriteSheet, Animation } from 'excalibur';
import Resources from './resources';
class Player extends Actor {
    health: number;
    speed: number;
    idleSprite: Sprite;

    constructor() {
        super(30,30,30,30);
        this.color = Color.Red;
        this.speed = 500;
    }
    
    idle() {
        this.setDrawing('idle');
    }

    clicked(coordinates:any) {
        // Move the player to coordinate
        this.setDrawing('walkDown');
        this.actions.clearActions();
        this.actions.moveTo(coordinates.x, coordinates.y, this.speed).asPromise().then(result=>{
            this.idle();
        });
    }
    
    public onInitialize(engine: Engine) {
        Resources.getInstance().onInitialize(engine);
        this.addDrawing('idle', Resources.getInstance().getSprite('playerIdle'));
        this.addDrawing('walkDown', Resources.getInstance().getAnimation('playerWalkDown'));
        this.idle();
        this.enableCapturePointer = true;
        // respond to click events
        engine.input.pointers.primary.on('down', (event:any)=>{
            this.clicked(event.coordinates.worldPos);
        })
    }

}

export default Player;