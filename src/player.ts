import { Actor, Cell, CollisionStartEvent, CollisionType, Color, Engine, Input, Vector } from 'excalibur';
import { PointerDownEvent } from 'excalibur/dist/Input';
import Controls from './controls';
import Direction from './direction';
import Game from './game';
import HealthBar from './healthbar';
import InputType from './In';
import Pickable from './interface/pickable';
import Inventory from './inventory';
import Entity from './entity';
import { TiledResource } from './lib/tiled';
import Resources from './resources';
import DropButton from './dropButton';
import * as defaults from './defaults.json';
import Enemy from './enemy';

class Player extends Actor {
    health: HealthBar;
    speed: number;
    maxHealth: number = 50;
    tiledResource: TiledResource;
    // How much travel in one update
    keyboardSpeed: Vector;
    inventory: Inventory;
    currentDirection: Direction;
    lastDirection: Direction;
    dropButton: DropButton;

    idle: boolean;

    static instance: Player = null;
    stopPointerDown: boolean;
    maxAttackPower: number;
    
    static getInstance() {
        if (Player.instance == null)
            Player.instance = new Player(Game.getInstance().tileResource);
        return Player.instance;
    }
    
    constructor(tiledResource: TiledResource) {
        super();
        this.color = Color.Red;
        this.speed = 200;
        this.keyboardSpeed = new Vector(5, 5);
        this.tiledResource = tiledResource;
        this.collisionType = CollisionType.Active;
        this.health = new HealthBar(this.maxHealth);
        this.inventory = new Inventory();
        this.dropButton = new DropButton();
        this.maxAttackPower = defaults.player.attack;
    }

    moveInDirection(coordinate:Vector, direction: Direction, setIdle: boolean = true) {
        if (this.currentDirection != direction) {
            this.setDrawing('walk' + direction);
            this.currentDirection = direction;
            this.lastDirection = direction;
        }
        return this.actions.moveTo(coordinate.x, coordinate.y, this.speed).asPromise().then(()=>{
            if (setIdle) {
                this.setDrawing('idle' + direction);
                this.currentDirection = null;
            }
            return Promise.resolve();
        });
    }

    move(coordinate:Vector, setIdle: boolean = true) {
        if (coordinate.x > this.pos.x) {
            return this.moveInDirection(coordinate, Direction.Right, setIdle);
        } else if (coordinate.x < this.pos.x) {
            return this.moveInDirection(coordinate, Direction.Left, setIdle);
        } else if(coordinate.y < this.pos.y) {
            return this.moveInDirection(coordinate, Direction.Up, setIdle);
        } else if (coordinate.y > this.pos.y) {
            return this.moveInDirection(coordinate, Direction.Down, setIdle);
        }
    }

    attackPower() {
        return Math.floor(Math.random() * this.maxAttackPower);
    }

    setPosition(pos: any) {
        if (pos)
            this.pos = new Vector(pos.x, pos.y);
    }

    getInventory(): Inventory {
        return this.inventory;
    }

    async moveTo(coordinate:any, pathFind:boolean = true, removeLast: boolean = false) {
        let cell:Cell = this.tiledResource.getTileMap().getCellByPoint(coordinate.x, coordinate.y)
        if(!cell || (cell && cell.solid && !pathFind)) {
            return;
        }
        this.idle = false;
        if (!pathFind) {
            this.pos.x = coordinate.x;
            this.pos.y = coordinate.y;
        } else {
            let path:Vector[] = this.tiledResource.findPath(this.pos, coordinate, removeLast);
            if (path.length) {
                this.actions.clearActions();
                for(let key in path) {
                    await this.move(path[key], parseInt(key) == path.length - 1);
                }
            }
        }
        this.idle = true;
        return Promise.resolve();
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
        if (this.health.empty()) {
            //end game and restart
            // location.reload();
        }
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

    isIdle() {
        return this.idle;
    }
    
    public onInitialize(engine: Engine) {
        for (let direction in Direction) {
            this.addDrawing('idle' + direction, Resources.getInstance().getSprite('playerIdle' + direction));
            this.addDrawing('walk' + direction, Resources.getInstance().getAnimation('playerWalk' + direction));
        }
        this.setDrawing('idleDown');
        this.setWidth(Resources.getInstance().getSprite('playerIdleUp').width);
        this.setHeight(Resources.getInstance().getSprite('playerIdleUp').height);
        // hack to fix collision on mobile
        this.setWidth(21)
        this.setHeight(21)
        this.add(this.health);
        
        // add drop button
        this.add(this.dropButton);
        
        // respond to click events
        engine.input.pointers.primary.on("down", (event: PointerDownEvent)=>{
            setTimeout(()=>{
                if (this.stopPointerDown) {
                    this.stopPointerDown = false;
                    return;
                }
                let pickable: Pickable = this.inventory.findItem(event.pos);
                if (pickable) {
                    this.inventory.selectItem(pickable);
                } else if (this.dropButton.contains(event.pos.x, event.pos.y)) {
                    this.inventory.placeSelected();
                } else {
                    this.clicked(event.pos);
                }
            },10);
        });

        // handle collisions
        this.on("collisionstart", this.collisionStart);
    }

    setIdle() {
        this.actions.clearActions();
        this.setDrawing('idle' + this.lastDirection);
    }

    place(pickable: Pickable): boolean {
        return this.inventory.remove(pickable);
    }

    pick(pickable: Entity): boolean {
        return this.inventory.add(pickable);
    }

    /**
     * When a collision happens between a player and some other object, handle the event
     */
    collisionStart(event: CollisionStartEvent) {
        if (event.other instanceof Entity) {
            event.other.pick();
        }
    }
}

export default Player;