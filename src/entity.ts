import { Actor, CollisionStartEvent, CollisionType, Sprite, Vector } from "excalibur";
import * as defaults from "./defaults.json";
import Game from "./game";
import Pickable from "./interface/pickable";
import Player from "./player";
import Resources from "./resources";
import Enemy from "./enemy";

class Entity extends Actor implements Pickable{
    spriteName: string;
    sprite: Sprite;
    name: string;
    type: string;
    canPick: boolean;
    // while drawing inventory item, the rectangle is drawn with padding
    padding: number;
    animation: string;
    // is inventory item
    inventory: boolean;
    // is item selected in invetory
    selected: boolean;
    // crafting
    craft: any;
    attackPower: number;
    // whether to expend on crafting
    expend: boolean;
    collisionTypeSaved: CollisionType;
    
    constructor(properties: any = {}, collisionType:CollisionType = CollisionType.Passive) {
        super(properties);
        this.type = properties.type
        this.spriteName = properties.type
        this.name = properties.name || properties.type
        this.collisionType = collisionType;
        this.collisionTypeSaved = collisionType;
        this.canPick = properties.canPick;
        this.padding = defaults.item.padding;
        this.craft = properties.craft;
        this.attackPower = properties.attackPower || 0;
        this.animation = properties.animation;
        this.expend = properties.expend || false;
    }
    
    restoreCollision() {
        this.collisionType = this.collisionTypeSaved;
    }
    
    collisionStart(event: CollisionStartEvent):void {
        if (event.other instanceof Entity && event.target instanceof Entity) {
            if (event.target.craft && event.target.craft[event.other.type]) {
                if (event.target.canPick && event.other.canPick) {
                    Game.getInstance().remove(event.other);
                    Game.getInstance().remove(event.target);
                    let crafted: Entity = Resources.getInstance().getItem(event.target.craft[event.other.type]);
                    crafted.drop();
                } else if (event.target.canPick){
                    // other is non movable
                    if (event.other.expend) {
                        Game.getInstance().remove(event.other);
                    }
                    Game.getInstance().remove(event.target);
                    let crafted: Entity = Resources.getInstance().getItem(event.target.craft[event.other.type]);
                    crafted.drop();
                }
            }
        } else if(event.target instanceof Entity && event.other instanceof Enemy) {
            if (event.target.craft && event.target.craft[event.other.type]) {
                Game.getInstance().remove(event.target);
                let crafted: Entity = Resources.getInstance().getItem(event.target.craft[event.other.type]);
                crafted.drop();
            }
        }
    }
    
    static initialize(properties: any, addToGame: boolean = true, collisionType: CollisionType = CollisionType.Passive) {
        let item:Entity = new Entity(properties, collisionType);
        Resources.getInstance().addItem(item);
        if (addToGame)
            Game.getInstance().add(item);
    }
    
    draw(ctx: CanvasRenderingContext2D, delta: number) {
        super.draw(ctx, delta);
        if (this.inventory) {
            if (this.selected) {
                ctx.strokeStyle = "#000000";
            } else {
                ctx.strokeStyle = "#e65c00";
            }
            ctx.strokeRect(this.x - this.getWidth()/2 - this.padding, this.y - this.getHeight()/2 - this.padding, this.getWidth() + 2 * this.padding, this.getHeight() + 2 * this.padding)
        }
    }
    
    onInitialize() {
        this.sprite = Resources.getInstance().getSprite(this.spriteName)
        if (this.sprite) {
            this.addDrawing(this.sprite);
            this.setWidth(this.sprite.width);
            this.setHeight(this.sprite.height);
            if (this.animation) {
                this.addDrawing("move", Resources.getInstance().getAnimation(this.animation));
                this.setDrawing("move");
            }
            this.on("collisionstart", this.collisionStart);
        }
    }
    
    remove() {
        Game.getInstance().remove(this);
    }
    
    // Pickable interface implementation

    pick(force:boolean = false):boolean {
        if (this.canPick || force) {
            if (Player.getInstance().getInventory().add(this)) {
                this.collisionType = CollisionType.PreventCollision;
                Game.getInstance().remove(this);
                Player.getInstance().add(this);
                this.setInventory(true);
                return true;
            }
            return false;
        }
        return false;
    }
    
    place(): boolean {
        if (Player.getInstance().getInventory().remove(this)) {
            this.pos = Player.getInstance().getPos().add(new Vector(0, this.getHeight() + 2 * this.padding));
            this.restoreCollision();
            Player.getInstance().remove(this);
            Game.getInstance().add(this);
            this.setInventory(false);
            return true;
        }
        return false;
    }

    drop() {
        this.pick(true);
        this.place();
    }

    setInventory(inventory: boolean) {
        this.inventory = inventory;
    }
    
    getInventory(): boolean {
        return this.inventory;
    }

    hudDisplay(position: number, selected: boolean = false) {
        // zero index to one index
        position++;
        this.selected = selected;
        this.x = - Game.getInstance().halfDrawWidth + position * ( this.getWidth() + 6 * this.padding );
        this.y = - Game.getInstance().halfDrawHeight + this.getHeight();
    }
}

export default Entity;