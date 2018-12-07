import { Actor, CollisionType, Vector, Sprite, Trigger, GameEvent, CollisionStartEvent } from "excalibur";
import Resources from "./resources";
import Player from "./player";
import Game from "./game";

class Item extends Actor {
    spriteName: string;
    sprite: Sprite;
    name: string;
    canPick: boolean;
    collisionTypeSaved: CollisionType;

    constructor(spriteName: string, pos: Vector, properties: any = {}, collisionType: CollisionType = CollisionType.Passive) {
        super({
            pos: pos
        })
        this.spriteName = spriteName;
        this.name = properties.name || spriteName;
        this.collisionType = collisionType;
        this.collisionTypeSaved = collisionType;
        this.canPick = properties.canPick;
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
        this.x = - Game.getInstance().halfCanvasWidth + this.getWidth();
        this.y = - Game.getInstance().halfCanvasHeight + this.getHeight();
    }

    placeItem(pos: Vector) {
        this.pos = pos;
        Game.getInstance().add(this);
    }

    onInitialize() {
        this.sprite = Resources.getInstance().getSprite(this.spriteName)
        this.addDrawing(this.sprite);
        this.setWidth(this.sprite.width);
        this.setHeight(this.sprite.height);
        this.visible = true;
        this.on("collisionstart", this.collisionStart);
    }
}

export default Item;