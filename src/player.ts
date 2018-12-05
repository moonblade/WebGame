import { Actor, Engine, Color, Texture, Sprite, Vector, SpriteSheet, Animation, ConsoleAppender, EnterTriggerEvent, Input, CollisionType, Cell } from 'excalibur';
import Resources from './resources';
import { TiledResource } from './lib/tiled';
import Controls from './controls';
import In from './In';
import Direction from './direction';
import HealthBar from './healthbar';

class Player extends Actor {
    health: HealthBar;
    speed: number;
    maxHealth: number = 50;
    tiledResource: TiledResource;
    // How much travel in one update
    keyboardSpeed: Vector;
    idleSprite: Sprite;
    
    constructor(tiledResource: TiledResource) {
        super(50,500,21,21);
        this.color = Color.Red;
        this.speed = 500;
        this.keyboardSpeed = new Vector(5, 5);
        this.tiledResource = tiledResource;
        this.collisionType = CollisionType.Active;
        this.health = new HealthBar(this.maxHealth);
        this.tiledResource.getTileMap().getCell(2,1).solid = true
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

    async moveTo(coordinate:any, pathFind:boolean = true) {
        let cell:Cell = this.tiledResource.getTileMap().getCellByPoint(coordinate.x, coordinate.y)
        if(!cell || (cell && cell.solid && !pathFind)) {
            this.actions.clearActions();
            return;
        }
        if (!pathFind) {
            this.pos.x = coordinate.x;
            this.pos.y = coordinate.y;
        } else {
            // TODO: Path finding algorithm required to move around obstacles in the room
            console.log("not implemented")
        }
        // this.actions.clearActions();
        // if (this.pos.x < coordinate.x) {
        //     await this.moveRight(coordinate);
        // }
        // if (this.pos.x > coordinate.x) {
        //     await this.moveLeft(coordinate);
        // }
        // if (this.pos.y > coordinate.y) {
        //     await this.moveUp(coordinate);
        // }
        // if (this.pos.y < coordinate.y) {
        //     await this.moveDown(coordinate);
        // }
    }

    clicked(coordinate:any) {
        this.moveTo(coordinate, true);
    }

    target(direction: Direction): Vector {
        switch (direction) {
            case Direction.Up:
                return new Vector(this.pos.x, this.pos.y - this.keyboardSpeed.y);
            case Direction.Down:
                return new Vector(this.pos.x, this.pos.y + this.keyboardSpeed.y);
            case Direction.Left:
                return new Vector(this.pos.x - this.keyboardSpeed.x, this.pos.y);
            case Direction.Right:
                return new Vector(this.pos.x + this.keyboardSpeed.x, this.pos.y);
        }
    }

    update(engine: Engine, delta: number) {
        super.update(engine, delta);
        for (let direction in Direction) {
            let dir: Direction = Direction[direction] as Direction;
            if (Controls.input(engine, In.release, dir)) {
                this.setDrawing('idle' + direction);
            }
            if (Controls.input(engine, In.held, dir)) {
                this.setDrawing('walk' + direction);
                this.moveTo(this.target(dir), false);
            }
        }
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
        this.add(this.health);
        // respond to click events
        engine.input.pointers.primary.on('down', (event:any)=>{
            this.clicked(event.coordinates.worldPos);
        })
    }

}

export default Player;