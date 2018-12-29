import { Actor, CollisionStartEvent, Sprite, CollisionType, Engine } from "excalibur";
import Resources from "./resources";
import Player from "./player";
import Game from "./game";
import HealthBar from "./healthbar";
import Entity from "./entity";
import * as defaults from "./defaults.json";

class Enemy extends Actor{
    type: string;
    spriteName: string;
    name: string;
    sprite: Sprite;
    attackPower: number;
    maxHealth: number;
    health: HealthBar;
    removeWeakness: number;
    reward: string[];
    weakness: string[];
    speed: number;
    sight: number;
    timeout: number;
    currentWait: number;

    constructor(properties: any) {
        super(properties);
        this.type = properties.type;
        this.spriteName = properties.type;
        this.name = properties.name || properties.type;
        this.collisionType = CollisionType.Active;
        this.attackPower = properties.attackPower;
        this.maxHealth = properties.health;
        this.health = new HealthBar(this.maxHealth);
        this.removeWeakness = properties.removeWeakness || false;
        this.reward = properties.reward || [];
        this.weakness = properties.weakness;
        this.speed = properties.speed || defaults.enemy.speed;
        this.sight = properties.sight || defaults.enemy.sight;
        this.timeout = properties.timeout || defaults.enemy.timeout;
        this.currentWait = this.timeout;
    }

    static initialize(properties: any, addToGame: boolean) {
        let door = new Enemy(properties);
        Resources.getInstance().addEnemy(door);
        if (addToGame)
            Game.getInstance().add(door);
    }

    canAttack() {
        this.currentWait--;
        if (this.currentWait == 0) {
            this.currentWait = this.timeout;
            return true;
        }
        return false;
    }
    update(engine: Engine, delta: number) {
        super.update(engine, delta);
        if (Math.abs(Player.getInstance().x - this.x) + Math.abs(Player.getInstance().y - this.y) < this.sight) {
            let item: Entity = Player.getInstance().getInventory().getSelectedItem();
            this.actions.clearActions();
            // this.setDrawing("idle");
            if (!(item && this.weakness.indexOf(item.type)>-1 && item.attackPower)) {
                if (!Player.getInstance().isIdle()){
                    this.setDrawing("move");
                    this.actions.moveTo(Player.getInstance().x, Player.getInstance().y, this.speed).asPromise().then(()=>{
                        this.setDrawing("idle");
                    });
                }
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
                    for (let item of this.reward) {
                        let entity: Entity = Resources.getInstance().getItem(item);
                        entity.drop();
                    }
                }
                if (Math.random() < this.removeWeakness) {
                    item.drop();
                    item.remove();
                }
            }
            let attack = Math.floor(Math.random() * this.attackPower);
            if (this.canAttack())
                Player.getInstance().health.change(-attack);
        }
    }

    onInitialize() {
        this.sprite = Resources.getInstance().getSprite(this.spriteName)
        if (this.sprite) {
            this.addDrawing("move", Resources.getInstance().getAnimation(this.type));
            this.addDrawing("idle", this.sprite);
            this.setDrawing("idle");
            this.setWidth(this.sprite.width);
            this.setHeight(this.sprite.height);
            this.on("collisionstart", this.collisionStart);
            this.add(this.health);
        }        
    }
}

export default Enemy;