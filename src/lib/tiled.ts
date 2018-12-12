import { Logger, Promise, Resource, SpriteSheet, Texture, TileMap, TileSprite, Vector, Cell } from 'excalibur';
import Helper from '../helper';
import AStar from './astar';
/**
* Tiled Map Interface
*
* Represents the interface for the Tiled exported data structure (JSON). Used
* when loading resources via Resource loader.
*/
export interface ITiledMap {
   width: number;
   height: number;
   layers: ITiledMapLayer[];
   nextobjectid: number;
   
   /**
   * Map orientation (orthogonal)
   */
   orientation: string;
   properties: {[key: string]: string};
   
   /**
   * Render order (right-down)
   */
   renderorder: string;
   tileheight: number;
   tilewidth: number;
   tilesets: ITiledTileSet[];
   version: number;
}

export interface ITiledMapLayer {
   data: number[]|string;
   height: number;
   name: string;
   opacity: number;
   properties: {[key: string]: string};
   encoding: string;
   compression?: string;
   
   /**
   * Type of layer (tilelayer, objectgroup)
   */
   type: string;
   visible: boolean;
   width: number;
   x: number;
   y: number;
   
   /**
   * Draw order (topdown (default), index)
   */
   draworder: string;
   objects: ITiledMapObject[];
}

export interface ITiledMapObject {
   id: number;
   
   /**
   * Tile object id
   */
   gid: number;
   height: number;
   name: string;
   properties: {[key: string]: string};
   rotation: number;
   type: string;
   visible: boolean;
   width: number;
   x: number;
   y: number;
   
   /**
   * Whether or not object is an ellipse
   */
   ellipse: boolean;
   
   /**
   * Polygon points
   */
   polygon: {x: number, y: number}[];
   
   /**
   * Polyline points
   */
   polyline: {x: number, y: number}[];
}

export interface ITiledTileSet {
   firstgid: number;
   image: string;
   
   /**
   * Excalibur texture associated with this tileset
   */
   imageTexture: ex.Texture;
   imageheight: number;
   imagewidth: number;
   margin: number;
   name: string;
   properties: {[key: string]: string};
   spacing: number;
   tilecount: number;
   tileheight: number;
   tilewidth: number;
   transparentcolor: string;
   terrains: ITiledMapTerrain[];
   tiles: {[key: string]: { terrain: number[] }};
   
   /**
   * Refers to external tileset file (should be JSON)
   */
   source: string;
}

export interface ITiledMapTerrain {
   name: string;
   tile: number;
}

export enum TiledMapFormat {
   
   /**
   * TMX map layer format
   * @unsupported
   */
   TMX,
   
   /**
   * JSON map layer format
   */
   JSON
}

export class TiledResource extends Resource<ITiledMap> {
   
   protected mapFormat: TiledMapFormat;
   
   public imagePathAccessor: (path: string, ts: ITiledTileSet) => string;
   public externalTilesetPathAccessor: (path: string, ts: ITiledTileSet) => string;
   public tileMap: TileMap;
   public aStar: AStar;
   
   constructor(path: string, mapFormat = TiledMapFormat.JSON) {
      switch (mapFormat) {
         case TiledMapFormat.JSON:
         super(path, "json");
         break;
         default:
         throw `The format ${mapFormat} is not currently supported. Please export Tiled map as JSON.`;
      }
      
      this.mapFormat = mapFormat;
      this.imagePathAccessor = this.externalTilesetPathAccessor = (p, tileset) => {
         
         // Use absolute path if specified
         if (p.indexOf('/') === 0) {
            return p;
         }
         
         // Load relative to map path
         let pp = path.split('/');
         let relPath = pp.concat([]);
         
         if (pp.length > 0) {
            // remove file part of path
            relPath.splice(-1);
         }
         relPath.push(p);
         return relPath.join('/');
      };
      
   }
   
   public findPath(source: Vector, destination: Vector) {
      let sourceCell:Cell = this.tileMap.getCellByPoint(source.x, source.y);
      let destCell:Cell = this.tileMap.getCellByPoint(destination.x, destination.y);
      return this.aStar.findPath(sourceCell, destCell);
   }
   
   public loadProperties(tileset: any) {
      if (tileset.tiles && tileset.tiles.length) {
         for (let tile of tileset.tiles) {
            tile.height = tileset.tileheight;
            tile.width = tileset.tilewidth;
            if (tile.properties && tile.properties.length) {
               for(let property of tile.properties) {
                  tile[property.name] = property.value;
               }
            }
         }
      }
   }
   
   public load(): Promise<ITiledMap> {
      var p = new Promise<ITiledMap>();
      
      super.load().then(map => {
         
         var promises: Promise<any>[] = [];
         
         // Loop through loaded tileset data
         // If we find an image property, then
         // load the image and sprite
         
         // If we find a source property, then
         // load the tileset data, merge it with
         // existing data, and load the image and sprite
         
         this.data.tilesets.forEach(ts => {
            if (ts.source) {
               var tileset = new Resource<ITiledTileSet>(
                  this.externalTilesetPathAccessor(ts.source, ts), "json");
                  
                  promises.push(tileset.load().then(external => {
                     (Object as any).assign(ts, external);
                  }));
               }
            });
            
            // wait or immediately resolve pending promises
            // for external tilesets
            Promise.join.apply(this, promises).then(() => {
               
               // clear pending promises
               promises = [];
               
               // retrieve images from tilesets and create textures
               this.data.tilesets.forEach(ts => {
                  var tx = new Texture(this.imagePathAccessor(ts.image, ts));
                  ts.imageTexture = tx;
                  promises.push(tx.load());
                  this.loadProperties(ts);
                  Logger.getInstance().debug("[Tiled] Loading associated tileset: " + ts.image);
               });
               
               Promise.join.apply(this, promises).then(() => {
                  p.resolve(map);
               }, (value?: any) => {
                  p.reject(value);
               });
            }, (value?: any) => {
               p.reject(value);
            });
            
            
         });
         
         return p;
      }
      
      public processData(data: ITiledMap): ITiledMap {
         if (typeof data !== "object") {
            throw `Tiled map resource ${this.path} is not the correct content type`;
         }
         if (data === void 0) {
            throw `Tiled map resource ${this.path} is empty`;
         }
         
         switch (this.mapFormat) {
            case TiledMapFormat.JSON:
            return parseJsonMap(data);
         }
      }
      
      public getTilesetForTile(gid: number): ITiledTileSet {
         for (var i = this.data.tilesets.length - 1; i >= 0; i--) {
            var ts = this.data.tilesets[i];
            
            if (ts.firstgid <= gid) {
               return ts;
            }
         }
         
         return null;
      }
      
      public getTileMap():TileMap {
         if (!this.tileMap)
            this.setTileMap();
         return this.tileMap
      }
      
      public setTileMap(): void {
         var map = new TileMap(0, 0, this.data.tilewidth, this.data.tileheight, this.data.height, this.data.width);
         
         // register sprite sheets for each tileset in map
         for (var ts of this.data.tilesets) {
            var cols = Math.floor(ts.imagewidth / ts.tilewidth);
            var rows = Math.floor(ts.imageheight / ts.tileheight);
            var ss = new SpriteSheet(ts.imageTexture, cols, rows, ts.tilewidth, ts.tileheight);
            
            map.registerSpriteSheet(ts.firstgid.toString(), ss);
         }
         
         for (var layer of this.data.layers) {
            
            if (layer.type === "tilelayer") {
               for (var i = 0; i < layer.data.length; i++) {
                  let gid = <number>layer.data[i];
                  
                  if (gid !== 0) {
                     var ts = this.getTilesetForTile(gid);
                     let tile = gid - ts.firstgid;
                     if (ts.tiles && ts.tiles[tile]) {
                        for (let property in ts.tiles[tile]) {
                           map.data[i][property] = map.data[i][property] || ts.tiles[tile][property];
                        }
                     }
                     map.data[i].sprites.push(new TileSprite(ts.firstgid.toString(), gid - ts.firstgid))
                  }
               }
            }
            if (layer.type === "objectgroup") {
               for (var i =0; i< layer.objects.length; ++i) {
                  let object = layer.objects[i];
                  let gid = object.gid;
                  if (gid !== 0) {
                     var ts = this.getTilesetForTile(gid);
                     let tile = gid - ts.firstgid;
                     if (ts.tiles && ts.tiles[tile]) {
                        for (let property in ts.tiles[tile]) {
                           object[property] = object[property] || ts.tiles[tile][property];
                        }
                     }
                     Helper.initObject(object);
                  }
               }
               //  Load items that may not be there in game space yet
               if (layer.objects.length) {
                  let gid = layer.objects[0].gid;
                  let ts:any = this.getTilesetForTile(gid);
                  for (let tile of ts.tiles) {
                     Helper.initObject(tile, false);
                  }
               }
            }
         }
         this.tileMap = map;
         this.aStar = new AStar(this.tileMap.data, this.data.height, this.data.width);
      }
   }
   
   /**
   * Handles parsing of JSON tiled data
   */
   var parseJsonMap = (data: ITiledMap): ITiledMap => {
      
      // Decompress layers
      if (data.layers) {
         for (var layer of data.layers) {
            
            if (typeof layer.data === "string") {
               
               if (layer.encoding === "base64") {
                  layer.data = decompressors.decompressBase64(
                     <string>layer.data,
                     layer.encoding,
                     layer.compression || ""
                     );
                  }
                  
               } else {
                  layer.data = decompressors.decompressCsv(<number[]>layer.data);
               }
               
            }
         }
         
         return data;
      }
      
      /**
      * Decompression implementations
      */
      var decompressors = {
         
         /**
         * Simplest (passes data through since it's uncompressed)
         */
         decompressCsv: (data: number[]) => {
            return data;
         },
         
         /**
         * Uses base64.js implementation to decode string into byte array
         * and then converts (with/without compression) to array of numbers
         */
         decompressBase64: (b64: string, encoding: string, compression: string) => {
            var i: number,
            j: number,
            l: number,
            tmp: number,
            placeHolders: number,
            arr: number[] | Uint8Array;
            
            if (b64.length % 4 > 0) {
               throw new Error('Invalid string. Length must be a multiple of 4')
            }
            
            var Arr = (typeof Uint8Array !== 'undefined')
            ? Uint8Array
            : Array;
            
            var PLUS = '+'.charCodeAt(0);
            var SLASH = '/'.charCodeAt(0);
            var NUMBER = '0'.charCodeAt(0);
            var LOWER = 'a'.charCodeAt(0);
            var UPPER = 'A'.charCodeAt(0);
            var PLUS_URL_SAFE = '-'.charCodeAt(0);
            var SLASH_URL_SAFE = '_'.charCodeAt(0);
            
            function decode(elt:any) {
               var code = elt.charCodeAt(0)
               if (code === PLUS || code === PLUS_URL_SAFE) return 62 // '+'
               if (code === SLASH || code === SLASH_URL_SAFE) return 63 // '/'
               if (code < NUMBER) return -1 // no match
               if (code < NUMBER + 10) return code - NUMBER + 26 + 26
               if (code < UPPER + 26) return code - UPPER
               if (code < LOWER + 26) return code - LOWER + 26
            }
            
            // the number of equal signs (place holders)
            // if there are two placeholders, than the two characters before it
            // represent one byte
            // if there is only one, then the three characters before it represent 2 bytes
            // this is just a cheap hack to not do indexOf twice
            var len = b64.length
            placeHolders = b64.charAt(len - 2) === '=' ? 2 : b64.charAt(len - 1) === '=' ? 1 : 0
            
            // base64 is 4/3 + up to two characters of the original data
            arr = new Arr(b64.length * 3 / 4 - placeHolders)
            
            // if there are placeholders, only get up to the last complete 4 chars
            l = placeHolders > 0 ? b64.length - 4 : b64.length
            
            var L = 0
            
            function push(v:any) {
               arr[L++] = v
            }
            
            for (i = 0, j = 0; i < l; i += 4, j += 3) {
               tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
               push((tmp & 0xFF0000) >> 16)
               push((tmp & 0xFF00) >> 8)
               push(tmp & 0xFF)
            }
            
            if (placeHolders === 2) {
               tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
               push(tmp & 0xFF)
            } else if (placeHolders === 1) {
               tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
               push((tmp >> 8) & 0xFF)
               push(tmp & 0xFF)
            }
            
            // Byte array
            // handle compression
            if ("zlib" === compression || "gzip" === compression) {
               //  arr = pako.inflate( arr );
            }
            
            var toNumber = function (byteArray: number[] | Uint8Array) {
               var value = 0;
               
               for (var i = byteArray.length - 1; i >= 0; i--) {
                  value = (value * 256) + byteArray[i] * 1;
               }
               
               return value;
            };
            
            var resultLen = arr.length / 4;
            var result = new Array<number>(resultLen);
            
            for (i = 0; i < resultLen; i++) {
               result[i] = toNumber(arr.slice(i * 4, i * 4 + 3));
            }
            
            return result;
         }
      }