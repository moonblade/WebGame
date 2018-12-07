import { Actor, CollisionType, Vector, Sprite, Trigger, GameEvent, CollisionStartEvent } from "excalibur";
import Resources from "./resources";
import Player from "./player";
import Game from "./game";

class Item extends Actor {
    spriteName: string;
    sprite: Sprite;
    name: string;
    canPick: boolean;

    constructor(spriteName: string, pos: Vector, properties: any = {}, collisionType: CollisionType = CollisionType.Passive) {
        super({
            pos: pos
        })
        this.spriteName = spriteName;
        this.name = properties.name || spriteName;
        this.addCollisionGroup("item");
        this.collisionType = collisionType;
        this.canPick = properties.canPick;
    }
    
    collisionStart(event: CollisionStartEvent):void {
        if (event.other == Player.getInstance()) {
            Player.getInstance().itemAction(this)
        }
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