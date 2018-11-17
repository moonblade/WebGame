import { Texture, ILoader, ILoadable, Loader, Animation, SpriteSheet, Engine, Vector, Sprite } from "excalibur";
import Game from "./game";
import * as textures from './resources/textures.json';
class Resources {
    textures: any = {};
    animations: any = {};
    sprites: any = {};
    static instance: Resources = null;
    initialized: boolean = false;
    frameSpeed: number = 100;

    constructor() {
        for (let key in textures) {
            this.textures[key] = new Texture(textures[key]);
        }
    }
    
    
    getTextures(): Texture[] {
        return Object.keys(this.textures).map(key=>this.textures[key]);
    }
    
    getResources(): ILoadable[] {
        return this.getTextures();
    }
    
    getTexture(key: string): Texture {
        return this.textures[key];
    }
    
    initResources(engine: Engine) {
        this.animations['playerWalkDown'] = new SpriteSheet(this.getTexture('playerWalkDown'), 3, 1, 14, 21).getAnimationForAll(engine, this.frameSpeed);
        this.animations['playerWalkUp'] = new SpriteSheet(this.getTexture('playerWalkUp'), 3, 1, 14, 21).getAnimationForAll(engine, this.frameSpeed);
        this.animations['playerWalkRight'] = new SpriteSheet(this.getTexture('playerWalkRight'), 3, 1, 14, 21).getAnimationForAll(engine, this.frameSpeed);
        this.animations['playerWalkLeft'] = new SpriteSheet(this.getTexture('playerWalkLeft'), 3, 1, 14, 21).getAnimationForAll(engine, this.frameSpeed);
    
        this.sprites['playerIdleUp'] = new Sprite(this.getTexture('playerWalkUp'), 0, 0, 14, 21);
        this.sprites['playerIdleDown'] = new Sprite(this.getTexture('playerWalkDown'), 0, 0, 14, 21);
        this.sprites['playerIdleRight'] = new Sprite(this.getTexture('playerWalkRight'), 0, 0, 14, 21);
        this.sprites['playerIdleLeft'] = new Sprite(this.getTexture('playerWalkLeft'), 0, 0, 14, 21);
    }

    onInitialize(engine: Engine) {
        if (this.initialized)
            return;
        this.initResources(engine);
        this.initialized = true;
    }

    getSprite(key: string): Sprite {
        let sprite:Sprite = this.sprites[key];
        if (sprite) {
            sprite.scale = new Vector(3,3);
            return sprite;
        }
    }

    getAnimation(key: string): Animation {
        let anim:Animation = this.animations[key];
        if (anim) {
            anim.scale = new Vector(3,3);
            return anim;
        }
    }

    static getInstance() {
        if (!Resources.instance) 
            Resources.instance = new Resources();
        return Resources.instance
    }

    getLoader(): Loader {
        let loader: Loader = new Loader();
        for (let resource of this.getResources()) {
            loader.addResource(resource);
        }
        return loader;
    }
}

export default Resources;