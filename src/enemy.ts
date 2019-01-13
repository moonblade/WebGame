import { Actor, CollisionStartEvent, Sprite, CollisionType, Engine, Vector } from "excalibur";
import Resources from "./resources";
import Player from "./player";
import Game from "./game";
import HealthBar from "./healthbar";
import Entity from "./entity";
import * as defaults from "./defaults.json";
import Chest from "./chest";
import { PointerDownEvent } from "excalibur/dist/Input";
import Helper from "./helper";

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
    moving: any;
    strikingDistance: any;

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
        this.strikingDistance = properties.strikingDistance || defaults.enemy.strikingDistance;
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
            if (!writeChanges)
                this.currentWait++;
            else
                this.currentWait = this.timeout;
            return true;
        }
        return false;
    }

    async moveToPlayer() {
        if (!this.moving) {
            this.moving = true;
            this.setDrawing("idle");
            if (!Player.getInstance().isIdle() && !this.noMove) {
                this.setDrawing("move");
                let path:Vector[] = Player.getInstance().tiledResource.findPath(this.pos, Player.getInstance().pos, true);
                if (path.length) {
                    this.actions.clearActions();
                    for(let key in path) {
                        await this.actions.moveTo(path[key].x, path[key].y, this.speed).asPromise();
                    }
                    this.attack(Player.getInstance(), true);
                }
            }
            this.moving = false;
        }
    }

    idle() {
        this.actions.clearActions();
        this.setDrawing("idle");
        this.moving = false;
    }

    update(engine: Engine, delta: number) {
        super.update(engine, delta);
        if (Math.abs(Player.getInstance().x - this.x) + Math.abs(Player.getInstance().y - this.y) < this.sight) {
            this.moveToPlayer();
        } else {
            this.idle()
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
        if (event.other instanceof Entity) {
            let item:Entity = event.other;
            if (item && this.itemWeakness.indexOf(item.type) > -1) {
                Game.getInstance().remove(this);
                this.giveReward();
                if (Math.random() < this.removeWeakness) {
                    item.drop();
                    item.remove();
                }
            }
        } else if (event.other instanceof Player) {
            this.idle();
        }
    }

    attack(player:Player, noDamage: boolean = false) {
        if (Helper.distance(this, Player.getInstance()) < this.strikingDistance) {
            let attack = Math.floor(Math.random() * this.attackPower);
            player.health.change(-attack);
        }

        if (!noDamage) {
            let weakness = Player.getInstance().getInventory().hasAny(this.weakness)
            let damage = Player.getInstance().attackPower();
            if (weakness) {
                damage = Math.floor(Math.random() * weakness.attackPower);
            }
            this.health.change(-damage);
            if (Math.random() < this.removeWeakness) {
                Player.getInstance().getInventory().remove(weakness);
            }
            
            if (this.health.empty()) {
                Game.getInstance().remove(this);
                this.giveReward();
            }
        }
    }

    async clicked() {
        Player.getInstance().stopPointerDown = true;
        await Player.getInstance().moveTo(this.pos, true, true);
        this.attack(Player.getInstance());
    }

    pointerDown = function(event:PointerDownEvent) {
        this.clicked();
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
            this.on("pointerdown", this.pointerDown)
            this.on("collisionstart", this.collisionStart);
            this.add(this.health);
        }        
    }
}

export default Enemy;