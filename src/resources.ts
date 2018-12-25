import { Animation, Engine, ILoadable, Loader, Resource, Sprite, SpriteSheet, Texture, Vector } from "excalibur";
import * as graphics from '../resources/graphics.json';
import * as map from "../resources/map/map.json";
import Entity from "./entity.js";
import { TiledResource } from "./lib/tiled";
import Chest from "./chest";
class Resources {
    textures: any = {};
    animations: any = {};
    resources: any = {};
    tiledResources: any = {};
    sprites: any = {};
    items: any = {};
    chests: any = {};
    static instance: Resources = null;
    initialized: boolean = false;
    frameSpeed: number = 100;
    scale: Vector;
    spriteTileSets: string[];

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

        this.scale = new Vector(graphics.constants.scale[0], graphics.constants.scale[1]);
        this.spriteTileSets = ["items"]

    }
    
    getTextures(): Texture[] {
        return Object.keys(this.textures).map(key=>this.textures[key]);
    }
    
    getTiledResource(key: string): TiledResource {
        return this.tiledResources[key];
    }

    addItem(item:Entity) {
        if (!this.items[item.name])
            this.items[item.name] = item;
    }

    getItem(key:string) {
        if(this.items[key]) {
            return this.items[key];
        }
    }

    addChest(chest:Chest) {
        if (!this.chests[chest.name])
            this.chests[chest.name] = chest;
    }

    getChest(key:string) {
        if(this.chests[key]) {
            return this.chests[key];
        }
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

        // get image sprites from map iteself
        for (let tileset of map.tilesets) {
            if (this.spriteTileSets.indexOf(tileset.name)>-1) {
                for (let tile of tileset.tiles) {
                    this.sprites[tile.type] = new Sprite(this.getTexture(tileset.name), tileset.tilewidth * tile.id, 0, tileset.tilewidth, tileset.tileheight);
                }
            }
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
            sprite.scale = this.scale;
            return sprite;
        }
    }

    getAnimation(key: string): Animation {
        let anim:Animation = this.animations[key];
        if (anim) {
            anim.scale = this.scale;
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
        // loader.logo = graphics.logo;
        for (let resource of this.getResources()) {
            loader.addResource(resource);
        }
        return loader;
    }
}

export default Resources;