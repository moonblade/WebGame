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

    // constructor(spriteName: string, pos: Vector, properties: any = {}, collisionType: CollisionType = CollisionType.Passive) {
    //     super({
    //         pos: pos
    //     })
    //     this.spriteName = spriteName;
    //     this.name = properties.name || spriteName;
    //     this.collisionType = collisionType;
    //     this.collisionTypeSaved = collisionType;
    //     this.canPick = properties.canPick;
    // }
    
    constructor(properties: any = {}, collisionType:CollisionType = CollisionType.Passive) {
        super(properties);
        this.spriteName = properties.name || properties.type
        this.name = properties.name || properties.type
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
        this.x = - Game.getInstance().halfCanvasWidth + position * this.getWidth();
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