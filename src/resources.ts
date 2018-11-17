import { Texture, ILoader, ILoadable, Loader, Animation, SpriteSheet, Engine, Vector, Sprite } from "excalibur";
import Game from "./game";

class Resources {
    textures: any = {};
    animations: any = {};
    sprites: any = {};
    static instance: Resources = null;
    initialized: boolean = false;
    frameSpeed: number = 150;

    constructor() {
        this.textures['playerWalkDown'] = new Texture("./src/resources/player/walk_down.png"); 
        this.textures['playerWalkUp'] = new Texture("./src/resources/player/walk_up.png"); 
        this.textures['playerWalkRight'] = new Texture("./src/resources/player/walk_right.png"); 
        this.textures['playerWalkLeft'] = new Texture("./src/resources/player/walk_left.png"); 
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
    
    onInitialize(engine: Engine) {
        if (this.initialized)
        return;
        this.animations['playerWalkDown'] = new SpriteSheet(this.getTexture('playerWalkDown'), 3, 1, 14, 21).getAnimationForAll(engine, this.frameSpeed);
        this.animations['playerWalkUp'] = new SpriteSheet(this.getTexture('playerWalkUp'), 3, 1, 14, 21).getAnimationForAll(engine, this.frameSpeed);
        this.animations['playerWalkRight'] = new SpriteSheet(this.getTexture('playerWalkRight'), 3, 1, 14, 21).getAnimationForAll(engine, this.frameSpeed);
        this.animations['playerWalkLeft'] = new SpriteSheet(this.getTexture('playerWalkLeft'), 3, 1, 14, 21).getAnimationForAll(engine, this.frameSpeed);

        this.sprites['playerIdleUp'] = new Sprite(this.getTexture('playerWalkUp'), 0, 0, 14, 21);
        this.sprites['playerIdleDown'] = new Sprite(this.getTexture('playerWalkDown'), 0, 0, 14, 21);
        this.sprites['playerIdleRight'] = new Sprite(this.getTexture('playerWalkRight'), 0, 0, 14, 21);
        this.sprites['playerIdleLeft'] = new Sprite(this.getTexture('playerWalkLeft'), 0, 0, 14, 21);
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