import { Actor, Sprite, CollisionType, CollisionStartEvent } from "excalibur";
import Resources from "./resources";
import Game from "./game";
import Player from "./player";
import Entity from "./entity";

class Door extends Actor{
    type: string;
    spriteName: string;
    name: string;
    sprite: Sprite;
    key: string;

    constructor(properties: any) {
        super(properties);
        this.type = properties.type
        this.spriteName = properties.type
        this.name = properties.name || properties.type
        this.collisionType = CollisionType.Fixed;
        this.key = properties.key;
    }

    static initialize(properties: any, addToGame: boolean) {
        let door = new Door(properties);
        Resources.getInstance().addDoor(door);
        if (addToGame)
            Game.getInstance().add(door);
    }

    collisionStart(event:CollisionStartEvent):void{
        if (event.other == Player.getInstance()) {
            let key:Entity = Player.getInstance().getInventory().getSelectedItem();
            if (key && key.name == this.key) {
                key.place();
                key.remove();
                Game.getInstance().remove(this);
            }
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

export default Door;