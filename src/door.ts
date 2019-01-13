import { Actor, Sprite, CollisionType, CollisionStartEvent, CollisionEndEvent } from "excalibur";
import Resources from "./resources";
import Game from "./game";
import Player from "./player";
import Entity from "./entity";
import Enemy from "./enemy";

class Door extends Actor{
    type: string;
    spriteName: string;
    name: string;
    sprite: Sprite;
    spriteLocked: Sprite;
    key: string;
    locked: boolean;

    constructor(properties: any) {
        super(properties);
        this.type = properties.type;
        this.spriteName = properties.type;
        this.name = properties.name || properties.type + Math.random();
        this.key = properties.key;
        this.locked = properties.locked || this.key != "default";
        this.collisionType = this.locked?CollisionType.Fixed:CollisionType.Passive;
    }

    static initialize(properties: any, addToGame: boolean) {
        let door = new Door(properties);
        Resources.getInstance().addDoor(door);
        if (addToGame)
            Game.getInstance().add(door);
    }

    collisionStart(event:CollisionStartEvent):void{
        if (event.other == Player.getInstance() || event.other instanceof Entity || event.other instanceof Enemy) {
            if (this.locked) {
                let key:Entity = Player.getInstance().getInventory().getSelectedItem();
                if (key && key.name == this.key) {
                    this.locked = false;
                    key.place();
                    key.remove();
                    this.collisionType = CollisionType.Passive;
                    this.setDrawing("unlocked");
                    this.visible = false;
                }
            } else {
                this.visible = false;
            }
        }
    }

    collisionEnd(event:any): void {
        this.visible = true;
    }

    onInitialize() {
        this.sprite = Resources.getInstance().getSprite(this.spriteName)
        this.spriteLocked = Resources.getInstance().getSprite(this.spriteName + "Locked")
        if (this.sprite) {
            this.addDrawing("unlocked", this.sprite);
            this.addDrawing("locked", this.spriteLocked);
            if (this.locked)
                this.setDrawing("locked");
            else
                this.setDrawing("unlocked");
            this.setWidth(this.sprite.width);
            this.setHeight(this.sprite.height);
            this.on("collisionstart", this.collisionStart);
            this.on("collisionend", this.collisionEnd);
        }        
    }

}

export default Door;