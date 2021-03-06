import Phaser from 'phaser';

import type { WorldScene } from '../../scenes/WorldScene';
import { AkkamonEngine } from '../engine/AkkamonEngine';

import type { Direction } from '../Direction';

import {
    RemotePlayerSprite
} from '../model/RemotePlayerSprite';

import {
    Queue,
    baseQueue,
    queueFromArray
} from '../../DataWrappers';


type RemoteMovementQueues = {
    [key: string]: {value: Direction[]}
}

export class RemotePlayerEngine extends AkkamonEngine {

    private scene: WorldScene;

    private trainerIDToRemotePlayerSprite: Map<string, RemotePlayerSprite> = new Map();

    constructor(scene: WorldScene) {
        super();
        this.scene = scene;
    }

    push(remoteMovementQueues: RemoteMovementQueues) {
        this.updateMembers(remoteMovementQueues);
        this.pushMovesToSprites(remoteMovementQueues);
    }

    pushMovesToSprites(remoteMovementQueues: RemoteMovementQueues) {
        this.trainerIDToRemotePlayerSprite.forEach((remoteSprite: RemotePlayerSprite, key: string) => {
            remoteSprite.push(remoteMovementQueues[key].value);
        });
    }

    update(delta: number): void {
        this.trainerIDToRemotePlayerSprite.forEach((remoteSprite: RemotePlayerSprite, key: string) => {
            if (remoteSprite.isMoving()) {
                console.log("remote player currently walking");
                remoteSprite.updatePixelPosition(delta);
            } else if (remoteSprite.hasMovesLeft()) {
                console.log("remote player starts moving");
                remoteSprite.startMoving();
            }
        });
    }

    updateMembers(newRemoteMovementQueues: RemoteMovementQueues) {
        const trainerIDToQueueValue = newRemoteMovementQueues;

        Object.keys(newRemoteMovementQueues).forEach((key: string) => {

            var moveQueue = trainerIDToQueueValue[key].value;
            if (moveQueue !== undefined) {

                // console.log("-> key: " + key + " has position " + newTilePos.x + ", " + newTilePos.y);

                if (!this.trainerIDToRemotePlayerSprite.has(key)) {
                    // console.log("adding remote player sprite for " + key);
                    this.trainerIDToRemotePlayerSprite.set(key,
                                                          new RemotePlayerSprite({
                                                              scene: this.scene,
                                                              tilePos: new Phaser.Math.Vector2(this.scene.spawnPointTilePos!),
                                                              texture: this.scene.textures.get("atlas"),
                                                              frame: "misa-front",
                                                              moveQueue: queueFromArray(moveQueue)
                                                              }
                                                          ));
                } else {
                    // console.log("key: " + key + " already had a sprite!");
                }
            }

        });

        this.trainerIDToRemotePlayerSprite.forEach((value: RemotePlayerSprite, key: string) => {
            if (!(key in newRemoteMovementQueues)) {
                // console.log("removing remote player sprite for " + key);
                this.trainerIDToRemotePlayerSprite.get(key)!.destroy();
                this.trainerIDToRemotePlayerSprite.delete(key);
            } else {
                // console.log("Player " + key + " was not removed!");
            }
        });
    }

    getData() {
        return this.trainerIDToRemotePlayerSprite;
    }
}
