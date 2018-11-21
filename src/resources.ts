import { Texture, ILoader, ILoadable, Loader, Animation, SpriteSheet, Engine, Vector, Sprite, Resource } from "excalibur";
import TiledResource from '@excaliburjs/excalibur-tiled';
import * as graphics from './resources/graphics.json';
class Resources {
    textures: any = {};
    animations: any = {};
    resources: any = {};
    tiledResources: any = {};
    sprites: any = {};
    static instance: Resources = null;
    initialized: boolean = false;
    frameSpeed: number = 100;

    constructor() {
        for (let key in graphics.textures) {
            this.textures[key] = new Texture(graphics.textures[key]);
        }

        for (let key in graphics.resources) {
            let a = graphics.resources[key];
            this.resources[key] = new Resource(a[0], a[1]);
        }

        for (let key in graphics.tiledResources) {
            let a = graphics.tiledResources[key];
            this.tiledResources[key] = new TiledResource(a);
        }

    }
    
    getTextures(): Texture[] {
        return Object.keys(this.textures).map(key=>this.textures[key]);
    }
    
    getTiledResource(key: string): TiledResource {
        return this.tiledResources[key];
    }

    getResources(): ILoadable[] {
        let resources = Object.keys(this.resources).map(key=>this.resources[key]);
        resources = resources.concat(this.getTextures());
        resources = resources.concat(Object.keys(this.tiledResources).map(key=>this.tiledResources[key]));
        // console.log(resources);
        return resources;
    }
    
    getTexture(key: string): Texture {
        return this.textures[key];
    }
    
    initResources(engine: Engine) {
        for (let key in graphics.animations) {
            let a = graphics.animations[key]
            this.animations[key] = new SpriteSheet(this.getTexture(a[0]), a[1], a[2], a[3], a[4]).getAnimationForAll(engine, this.frameSpeed);
        }

        for (let key in graphics.sprites) {
            let a = graphics.sprites[key]
            this.sprites[key] = new Sprite(this.getTexture(a[0]), a[1], a[2], a[3], a[4]);
        }
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