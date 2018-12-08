import { Actor, CollisionType, Vector, Sprite, Trigger, GameEvent, CollisionStartEvent } from "excalibur";
import Resources from "./resources";
import Player from "./player";
import Game from "./game";
import * as defaults from "./defaults.json"

class Item extends Actor {
    spriteName: string;
    sprite: Sprite;
    name: string;
    canPick: boolean;
    // while drawing inventory item, the rectangle is drawn with padding
    padding: number;
    // is inventory item
    inventory: boolean;
    collisionTypeSaved: CollisionType;

    constructor(properties: any = {}, collisionType:CollisionType = CollisionType.Passive) {
        super(properties);
        this.spriteName = properties.name || properties.type
        this.name = properties.name || properties.type
        this.collisionType = collisionType;
        this.collisionTypeSaved = collisionType;
        this.canPick = properties.canPick;
        this.padding = defaults.item.padding;
    }
    
    setInventory(inventory: boolean, position: number = 0) {
        this.inventory = inventory;
        if (this.inventory) {
            this.hudDisplay(position)
            this.collisionType = CollisionType.PreventCollision;
            Game.getInstance().remove(this);
            Player.getInstance().add(this);
        } else {
            // Item drop position
            this.pos = Player.getInstance().pos.add(new Vector(0, this.getHeight()));
            this.restoreCollision();
            Player.getInstance().remove(this);
            Game.getInstance().add(this);
        }
    }

    restoreCollision() {
        this.collisionType = this.collisionTypeSaved;
    }

    collisionStart(event: CollisionStartEvent):void {
        if (event.other == Player.getInstance()) {
            Player.getInstance().itemAction(this)
        }
    }

    hudDisplay(position: number) {
        // zero index to one index
        position++;
        this.x = - Game.getInstance().halfCanvasWidth + position * ( this.getWidth() + 0 );
        this.y = - Game.getInstance().halfCanvasHeight + this.getHeight();
    }

    placeItem(pos: Vector) {
        this.pos = pos;
        Game.getInstance().add(this);
    }

    static initialize(properties: any) {
        let item:Item = new Item(properties);
        Resources.getInstance().addItem(item);
        Game.getInstance().add(item);
    }

    draw(ctx: CanvasRenderingContext2D, delta: number) {
        super.draw(ctx, delta);
        if (this.inventory) {
            ctx.strokeStyle = "#FF8533";
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
}

export default Item;