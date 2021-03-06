import Phaser from 'phaser';

import type {
    BasePhaserScene
} from '../PhaserTypes';

import { WorldScene } from './WorldScene';

function createBootScene<PhaserScene extends BasePhaserScene>(base: PhaserScene, sceneKey: string) {
    return class BootScene extends base {
        preload(): void {
            this.load.image("tiles", "assets/tilesets/akkamon-demo-extruded.png");
            // load from json!
            this.load.tilemapTiledJSON("map", "assets/tilemaps/akkamon-demo-tilemap.json");

            // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
            // the player animations (walking left, walking right, etc.) in one image. For more info see:

            //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
            // If you don't use an atlas, you can do the same thing with a spritesheet, see:
            //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
            this.load.atlas("atlas",
                          "assets/atlas/atlas.png",
                              "assets/atlas/atlas.json");

            this.load.image("menu", "assets/images/pMenu.png");
            this.load.image("picker", "assets/images/menupicker.png");

            this.load.pack("pokemon-yellow-front", "assets/pokemon/main-sprites/yellow/pokemon-yellow-front.json")
            this.load.pack("pokemon-yellow-back", "assets/pokemon/main-sprites/yellow/pokemon-yellow-back.json")

            this.load.pack("general-interface", "assets/images/general-ui.json")
            this.load.pack("battle-interface", "assets/images/battle-ui.json")

            this.load.image("playerBack", "assets/pokemon/playerBack.png")
            this.load.image("opponentFront", "assets/pokemon/opponentFront.png")

        }

        create(): void {
            this.scene
            .launch('DemoScene')
            .remove()
        }
    }
}


let BootScene = createBootScene(Phaser.Scene, "BootScene");

export default BootScene;
