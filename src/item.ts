import { Actor, CollisionStartEvent, CollisionType, Sprite, Vector } from "excalibur";
import * as defaults from "./defaults.json";
import Game from "./game";
import Pickable from "./interface/pickable";
import Player from "./player";
import Resources from "./resources";

class Item extends Actor implements Pickable{
    spriteName: string;
    sprite: Sprite;
    name: string;
    type: string;
    canPick: boolean;
    // while drawing inventory item, the rectangle is drawn with padding
    padding: number;
    // is inventory item
    inventory: boolean;
    // is item selected in invetory
    selected: boolean;
    // crafting
    craft: any;
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
    }
    
    restoreCollision() {
        this.collisionType = this.collisionTypeSaved;
    }
    
    collisionStart(event: CollisionStartEvent):void {
        if (event.other instanceof Item && event.target instanceof Item) {
            if (event.target.craft && event.target.craft[event.other.type]) {
                Game.getInstance().remove(event.other);
                Game.getInstance().remove(event.target);
                let crafted: Item = Resources.getInstance().getItem(event.target.craft[event.other.type]);
                crafted.pick();
            }
        }
    }
    
    static initialize(properties: any, addToGame: boolean = true) {
        let item:Item = new Item(properties);
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
            this.on("collisionstart", this.collisionStart);
        }
    }
    
    
    // Pickable interface implementation

    pick():boolean {
        if (this.canPick) {
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

export default Item;