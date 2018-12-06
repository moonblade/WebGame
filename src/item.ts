import { Actor, CollisionType, Vector, Sprite } from "excalibur";
import Resources from "./resources";

class Item extends Actor {
    spriteName: string;
    sprite: Sprite;
    name: string;

    constructor(spriteName: string, pos: Vector, collisionType: CollisionType = CollisionType.Passive, name?: string) {
        super()
        this.pos.x = pos.x;
        this.pos.y = pos.y;
        this.spriteName = spriteName;
        this.name = name || spriteName;
        this.addCollisionGroup("item");
        this.collisionType = collisionType;
    }
    
    onInitialize() {
        this.sprite = Resources.getInstance().getSprite(this.spriteName)
        this.addDrawing(this.sprite);
        this.setWidth(this.sprite.width);
        this.setHeight(this.sprite.height);
    }
}

export default Item;