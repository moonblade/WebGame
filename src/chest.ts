import { Actor, CollisionType, Sprite, CollisionStartEvent } from "excalibur";
import Entity from "./entity";
import Resources from "./resources";
import Game from "./game";
import Player from "./player";

class Chest extends Actor {
    contents: string[] = [];
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
        this.collisionType = CollisionType.Active;
        this.key = properties.key;
        this.contents = properties.contents || [];
    }

    static initialize(properties: any, addToGame: boolean) {
        let chest = new Chest(properties);
        Resources.getInstance().addChest(chest);
        if (addToGame)
            Game.getInstance().add(chest);
    }

    collisionStart(event:CollisionStartEvent):void{
        if (event.other == Player.getInstance()) {
            let key:Entity = Player.getInstance().getInventory().getSelectedItem();
            if (key && key.name == this.key) {
                key.place();
                key.remove();
                Game.getInstance().remove(this);
                for (let content of this.contents) {
                    let entity:Entity = Resources.getInstance().getItem(content);
                    entity && entity.pick();
                }
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

export default Chest;