import { Actor, Engine, Color, Texture, Sprite, Vector, SpriteSheet, Animation, ConsoleAppender } from 'excalibur';
import Resources from './resources';
class Player extends Actor {
    health: number;
    speed: number;
    idleSprite: Sprite;
    inMotion: boolean;

    constructor() {
        super(30,30,30,30);
        this.color = Color.Red;
        this.speed = 500;
    }

    moveRight(coordinate: Vector) {
        this.setDrawing('walkRight');
        return this.actions.moveTo(coordinate.x, this.pos.y, this.speed).asPromise().then(()=>{
            this.setDrawing('idleRight');
            return Promise.resolve();
        });
    }

    moveLeft(coordinate: Vector) {
        this.setDrawing('walkLeft');
        return this.actions.moveTo(coordinate.x, this.pos.y, this.speed).asPromise().then(()=>{
            this.setDrawing('idleLeft');
            return Promise.resolve();
        });
    }

    moveUp(coordinate: Vector) {
        this.setDrawing('walkUp');
        return this.actions.moveTo(this.pos.x, coordinate.y, this.speed).asPromise().then(()=>{
            this.setDrawing('idleUp');
            return Promise.resolve();
        });
    }

    moveDown(coordinate: Vector) {
        this.setDrawing('walkDown');
        return this.actions.moveTo(this.pos.x, coordinate.y, this.speed).asPromise().then(()=>{
            this.setDrawing('idleDown');
            return Promise.resolve();
        });
    }

    async moveTo(coordinate:any) {
        // TODO: Path finding algorithm required to move around obstacles in the room
        this.actions.clearActions();
        if (this.pos.x < coordinate.x) {
            await this.moveRight(coordinate);
        }
        if (this.pos.x > coordinate.x) {
            await this.moveLeft(coordinate);
        }
        if (this.pos.y > coordinate.y) {
            await this.moveUp(coordinate);
        }
        if (this.pos.y < coordinate.y) {
            await this.moveDown(coordinate);
        }
    }

    clicked(coordinate:any) {
        this.moveTo(coordinate);
    }
    
    public onInitialize(engine: Engine) {
        Resources.getInstance().onInitialize(engine);
        this.addDrawing('idleDown', Resources.getInstance().getSprite('playerIdleDown'));
        this.addDrawing('idleUp', Resources.getInstance().getSprite('playerIdleUp'));
        this.addDrawing('idleRight', Resources.getInstance().getSprite('playerIdleRight'));
        this.addDrawing('idleLeft', Resources.getInstance().getSprite('playerIdleLeft'));
        this.addDrawing('walkDown', Resources.getInstance().getAnimation('playerWalkDown'));
        this.addDrawing('walkUp', Resources.getInstance().getAnimation('playerWalkUp'));
        this.addDrawing('walkLeft', Resources.getInstance().getAnimation('playerWalkLeft'));
        this.addDrawing('walkRight', Resources.getInstance().getAnimation('playerWalkRight'));
        this.setDrawing('idleDown');
        this.enableCapturePointer = true;
        // respond to click events
        engine.input.pointers.primary.on('down', (event:any)=>{
            this.clicked(event.coordinates.worldPos);
        })
    }

}

export default Player;