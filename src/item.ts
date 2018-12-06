import { Actor, CollisionType, Vector, Sprite, Trigger } from "excalibur";
import Resources from "./resources";
import Player from "./player";
import Game from "./game";

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
    
    createTrigger() {
        let trigger = new Trigger({
            width: this.getWidth(),
            height: this.getHeight(),
            pos: this.pos,
            target: Player.getInstance(),
            action: ()=>Player.getInstance().itemAction(this)
        });
        Game.getInstance().add(trigger);
    }

    onInitialize() {
        this.sprite = Resources.getInstance().getSprite(this.spriteName)
        this.addDrawing(this.sprite);
        this.setWidth(this.sprite.width);
        this.setHeight(this.sprite.height);
        this.createTrigger();
    }
}

export default Item;