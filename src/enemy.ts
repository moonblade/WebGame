import { Actor, CollisionStartEvent, Sprite, CollisionType, Engine } from "excalibur";
import Resources from "./resources";
import Player from "./player";
import Game from "./game";
import HealthBar from "./healthbar";
import Entity from "./entity";
import * as defaults from "./defaults.json";
import Chest from "./chest";

class Enemy extends Actor{
    type: string;
    spriteName: string;
    name: string;
    sprite: Sprite;
    attackPower: number;
    maxHealth: number;
    health: HealthBar;
    removeWeakness: number;
    reward: any;
    weakness: string[];
    itemWeakness: string[];
    speed: number;
    sight: number;
    timeout: number;
    currentWait: number;
    noMove: boolean;

    constructor(properties: any) {
        super(properties);
        this.type = properties.type;
        this.spriteName = properties.type;
        this.name = properties.name || properties.type;
        this.collisionType = CollisionType.Active;
        this.attackPower = properties.attackPower;
        this.maxHealth = properties.health;
        this.health = new HealthBar(this.maxHealth, properties.noHealthDisplay);
        this.removeWeakness = properties.removeWeakness || false;
        this.reward = properties.reward || {};
        this.weakness = properties.weakness || [];
        this.itemWeakness = properties.itemWeakness || [];
        this.speed = properties.speed || defaults.enemy.speed;
        this.sight = properties.sight || defaults.enemy.sight;
        this.timeout = properties.timeout || defaults.enemy.timeout;
        this.currentWait = this.timeout;
        this.noMove = properties.noMove || false;
    }

    static initialize(properties: any, addToGame: boolean) {
        let door = new Enemy(properties);
        Resources.getInstance().addEnemy(door);
        if (addToGame)
            Game.getInstance().add(door);
    }

    canAttack(writeChanges: boolean = true) {
        this.currentWait--;
        if (this.currentWait == 0) {
            this.currentWait = this.timeout;
            return true;
        }
        if (!writeChanges)
            this.currentWait++;
        return false;
    }
    update(engine: Engine, delta: number) {
        super.update(engine, delta);
        if (Math.abs(Player.getInstance().x - this.x) + Math.abs(Player.getInstance().y - this.y) < this.sight) {
            let item: Entity = Player.getInstance().getInventory().getSelectedItem();
            this.actions.clearActions();
            // this.setDrawing("idle");
            // if (!(item && this.weakness.indexOf(item.type)>-1 && item.attackPower)) {
                if (!Player.getInstance().isIdle() && !this.noMove) {
                    this.setDrawing("move");
                    this.actions.moveTo(Player.getInstance().x, Player.getInstance().y, this.speed).asPromise().then(()=>{
                        this.setDrawing("idle");
                    });
                }
            // }
        }
    }

    giveReward() {
        if (this.reward && this.reward.entity) {
            for (let item of this.reward.entity) {
                let entity: Entity = Resources.getInstance().getItem(item);
                entity.drop();
            }
        } if (this.reward && this.reward.chest) {
            for (let key of this.reward.chest) {
                let chest: Chest = Resources.getInstance().getChest(key);
                chest.dropBy(this);
            }
        }
    }
    collisionStart(event:CollisionStartEvent):void{
        if (event.other == Player.getInstance()) {
            let item: Entity = Player.getInstance().getInventory().getSelectedItem();
            if (item && this.weakness.indexOf(item.type)>-1 && item.attackPower) {
                let damage = Math.floor(Math.random() * item.attackPower);
                this.health.change(-damage);
                if (this.health.empty()) {
                    Game.getInstance().remove(this);
                    this.giveReward();
                }
                if (this.canAttack(false) && Math.random() < this.removeWeakness) {
                    item.drop();
                    item.remove();
                }
            }
            let attack = Math.floor(Math.random() * this.attackPower);
            if (this.canAttack()) {
                Player.getInstance().health.change(-attack);
            }
        } else if (event.other instanceof Entity) {
            let item:Entity = event.other;
            if (item && this.itemWeakness.indexOf(item.type) > -1) {
                Game.getInstance().remove(this);
                this.giveReward();
                if (Math.random() < this.removeWeakness) {
                    item.drop();
                    item.remove();
                }
            }
        }
    }

    onInitialize() {
        this.sprite = Resources.getInstance().getSprite(this.spriteName)
        if (this.sprite) {
            this.addDrawing("move", Resources.getInstance().getAnimation(this.type));
            this.addDrawing("idle", this.sprite);
            this.setDrawing("idle");
            if (this.noMove) {
                this.setDrawing("move");
            }
            this.setWidth(this.sprite.width);
            this.setHeight(this.sprite.height);
            this.on("collisionstart", this.collisionStart);
            this.add(this.health);
        }        
    }
}

export default Enemy;