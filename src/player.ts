import { Actor, Cell, CollisionStartEvent, CollisionType, Color, Engine, Input, Vector } from 'excalibur';
import { PointerDownEvent } from 'excalibur/dist/Input';
import Controls from './controls';
import Direction from './direction';
import Game from './game';
import HealthBar from './healthbar';
import InputType from './In';
import Pickable from './interface/pickable';
import Inventory from './inventory';
import Item from './item';
import { TiledResource } from './lib/tiled';
import Resources from './resources';

class Player extends Actor {
    health: HealthBar;
    speed: number;
    maxHealth: number = 50;
    tiledResource: TiledResource;
    // How much travel in one update
    keyboardSpeed: Vector;
    inventory: Inventory;
    static instance: Player = null;
    
    static getInstance() {
        if (Player.instance == null)
            Player.instance = new Player(Game.getInstance().tileResource);
        return Player.instance;
    }
    
    constructor(tiledResource: TiledResource) {
        super(0,0,21,21);
        this.color = Color.Red;
        this.speed = 500;
        this.keyboardSpeed = new Vector(5, 5);
        this.tiledResource = tiledResource;
        this.collisionType = CollisionType.Active;
        this.health = new HealthBar(this.maxHealth);
        this.inventory = new Inventory();
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

    setPosition(pos: any) {
        this.pos = new Vector(pos.x, pos.y);
    }

    getInventory(): Inventory {
        return this.inventory;
    }

    async moveTo(coordinate:any, pathFind:boolean = true) {
        let cell:Cell = this.tiledResource.getTileMap().getCellByPoint(coordinate.x, coordinate.y)
        if(!cell || (cell && cell.solid && !pathFind)) {
            return;
        }
        if (!pathFind) {
            this.pos.x = coordinate.x;
            this.pos.y = coordinate.y;
        } else {
            // TODO: Path finding algorithm required to move around obstacles in the room
            this.pos.x = coordinate.x;
            this.pos.y = coordinate.y;
            console.log("not implemented")
        }
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
            if (Controls.input(engine, InputType.release, dir)) {
                this.setDrawing('idle' + direction);
            }
            if (Controls.input(engine, InputType.held, dir)) {
                this.setDrawing('walk' + direction);
                this.moveTo(this.target(dir), false);
            }
        }

        if (engine.input.keyboard.wasPressed(Input.Keys.R)) {
            this.inventory.placeSelected();
        }
    }

    getPos(): Vector {
        return this.pos;
    }

    public onInitialize(engine: Engine) {
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
        Game.getInstance().input.pointers.primary.on("down", (event: PointerDownEvent)=>{
            let pickable: Pickable = this.inventory.findItem(event.pos);
            if (pickable) {
                this.inventory.selectItem(pickable);
            } else {
                this.clicked(event.pos);
            }
        });

        // handle collisions
        this.on("collisionstart", this.collisionStart);
    }

    place(pickable: Pickable): boolean {
        return this.inventory.remove(pickable);
    }

    pick(pickable: Pickable): boolean {
        return this.inventory.add(pickable);
    }

    itemAction(item: Item) {
        if (item.canPick) {
            // change to pick method for now
        }
    }

    /**
     * When a collision happens between a player and some other object, handle the event
     */
    collisionStart(event: CollisionStartEvent) {
        if (event.other instanceof Item) {
            event.other.pick();
        }
    }
}

export default Player;