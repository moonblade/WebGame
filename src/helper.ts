import Entity from "./entity";
import Player from "./player";
import Chest from "./chest";
import Door from "./door";
import Enemy from "./enemy";
import { Actor } from "excalibur";

class Helper {
    static initObject(object: any = {}, addToGame: boolean = true) {
        this.loadProperties(object);
        if (object.class === "entity") {
            Entity.initialize(object, addToGame);
        } else if (object.class === "chest") {
            Chest.initialize(object, addToGame);
        } else if (object.class === "door") {
            Door.initialize(object, addToGame);
        } else if (object.class === "enemy") {
            Enemy.initialize(object, addToGame);
        } else if (object.type === "spawn") {
            if (addToGame)
                Player.getInstance().setPosition(object);
        }
    }
 
    static loadProperties(object :any = {}) {
        if (object.properties && object.properties.length) {
            for(let property of object.properties) {
               if (typeof property.value == 'string' && (property.value.indexOf('{') == 0 || property.value.indexOf('[') == 0)) 
                  object[property.name]  = JSON.parse(property.value);
               else
                  object[property.name] = property.value;
            }
        }
        if (object.x)
            object.x = object.x + 10.5
            object.y = object.y - 10.5
    }

    static distance(a: Actor, b: Actor) {
        return Math.abs(a.x-b.x) + Math.abs(a.y-b.y);
    }
}

export default Helper;