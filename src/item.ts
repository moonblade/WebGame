import { Actor, CollisionType, Vector, Sprite, Trigger, GameEvent, CollisionStartEvent } from "excalibur";
import Resources from "./resources";
import Player from "./player";
import Game from "./game";
import * as defaults from "./defaults.json"
import { PointerUpEvent, PointerDownEvent } from "excalibur/dist/Input";
import Pickable from "./interface/pickable";

class Item extends Actor implements Pickable{
    spriteName: string;
    sprite: Sprite;
    name: string;
    canPick: boolean;
    // while drawing inventory item, the rectangle is drawn with padding
    padding: number;
    // is inventory item
    inventory: boolean;
    // is item selected in invetory
    selected: boolean;
    collisionTypeSaved: CollisionType;
    
    constructor(properties: any = {}, collisionType:CollisionType = CollisionType.Passive) {
        super(properties);
        this.spriteName = properties.type
        this.name = properties.name || properties.type
        this.collisionType = collisionType;
        this.collisionTypeSaved = collisionType;
        this.canPick = properties.canPick;
        this.padding = defaults.item.padding;
        
    }
    
    restoreCollision() {
        this.collisionType = this.collisionTypeSaved;
    }
    
    collisionStart(event: CollisionStartEvent):void {
        if (event.other == Player.getInstance()) {
            this.pick();
        }
    }
    
    static initialize(properties: any) {
        let item:Item = new Item(properties);
        Resources.getInstance().addItem(item);
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