import { Texture, ILoader, ILoadable, Loader, Animation, SpriteSheet, Engine, Vector, Sprite } from "excalibur";
import Game from "./game";

class Resources {
    textures: any = {};
    animations: any = {};
    sprites: any = {};
    static instance: Resources = null;
    initialized: boolean = false;

    constructor() {
        this.textures['playerWalk'] = new Texture("./src/resources/player/sprite.png"); 
        this.textures['playerWalkDown'] = new Texture("./src/resources/player/walk_down.png"); 
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
        this.animations['playerWalkDown'] = new SpriteSheet(this.getTexture('playerWalkDown'), 3, 1, 14, 21).getAnimationForAll(engine, 150);

        this.sprites['playerIdle'] = new Sprite(this.getTexture('playerWalk'), 8, 7, 14, 21);
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