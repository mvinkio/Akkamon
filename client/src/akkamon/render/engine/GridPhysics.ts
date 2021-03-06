import Phaser from 'phaser';

import { TILE_SIZE } from '../../scenes/WorldScene';

import { AkkamonEngine } from './AkkamonEngine';

import type { PlayerSprite } from '../model/PlayerSprite';

import { Direction } from '../Direction';

import {
    StartMovingEvent,
    StopMovingEvent,
    NewTilePosEvent
} from '../../client/OutgoingEvents';

export class GridPhysics extends AkkamonEngine {

    static movementDirectionVectors: {
        [key in Direction]?: Phaser.Math.Vector2;
    } = {
        [Direction.UP]: Phaser.Math.Vector2.UP,
        [Direction.DOWN]: Phaser.Math.Vector2.DOWN,
        [Direction.LEFT]: Phaser.Math.Vector2.LEFT,
        [Direction.RIGHT]: Phaser.Math.Vector2.RIGHT,
    }

    private movementDirection: Direction = Direction.NONE;
    private readonly speedPixelsPerSecond: number = TILE_SIZE * 4;

    private tileSizePixelsWalked: number = 0;

    private lastMovementIntent = Direction.NONE;

    constructor(
        private playerSprite: PlayerSprite,
        private tileMap: Phaser.Tilemaps.Tilemap
    ) {
        super()
    }

    getPlayerTilePos() {
        return this.playerSprite.tilePos;
    }

    getPlayerPixelPos() {
        return this.playerSprite.getPosition();
    }


    movePlayerSprite(direction: Direction): void {
        this.lastMovementIntent = direction;

        if (this.isMoving()) return;

        if (this.isBlockingDirection(direction)) {
            this.playerSprite.stopAnimation(direction);
        } else {
            this.startMoving(direction);
        }
    }

    private isMoving(): boolean {
        return this.movementDirection != Direction.NONE;
    }

    private startMoving(direction: Direction): void {
        console.log("Sending startMovingEvent");
        this.client.sendStartMove(direction);
        this.playerSprite.startAnimation(direction);
        this.movementDirection = direction;
        this.updatePlayerSpriteTilePosition();
    }

    update(delta: number): void {
        if (this.isMoving()) {
            this.updatePlayerSpritePosition(delta);
        }
        this.lastMovementIntent = Direction.NONE;
    }

    private updatePlayerSpritePosition(delta: number) {
        const pixelsToWalkThisUpdate = this.getPixelsToWalkThisUpdate(delta);

        if (!this.willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate)) {
            this.spriteMovement(pixelsToWalkThisUpdate);
        } else if (this.shouldContinueMoving()) {
            this.spriteMovement(pixelsToWalkThisUpdate);
            this.updatePlayerSpriteTilePosition();
        } else {
            this.spriteMovement(TILE_SIZE - this.tileSizePixelsWalked);
            this.stopMoving();
        }
    }

    private updatePlayerSpriteTilePosition() {
        this.client.sendNewTilePos(this.playerSprite.getTilePos());
        this.playerSprite.setTilePos(
            this.playerSprite
            .getTilePos()
            .add(GridPhysics.movementDirectionVectors[this.movementDirection]!)
        );
    }

    private shouldContinueMoving(): boolean {
        return (
            this.movementDirection == this.lastMovementIntent &&
                !this.isBlockingDirection(this.lastMovementIntent)

        );
    }

    private spriteMovement(pixelsToMove: number) {

        this.tileSizePixelsWalked += pixelsToMove;
        this.tileSizePixelsWalked %= TILE_SIZE;


        const directionVec = GridPhysics.movementDirectionVectors[
            this.movementDirection
        ]!.clone();

        const movementDistance = directionVec.multiply(
            new Phaser.Math.Vector2(pixelsToMove)
        );

        const newPlayerPos = this.playerSprite.getPosition().add(movementDistance);
        this.playerSprite.newPosition(newPlayerPos);
    }

    private willCrossTileBorderThisUpdate(
        pixelsToWalkThisUpdate: number
    ): boolean {
        return (
            this.tileSizePixelsWalked + pixelsToWalkThisUpdate >= TILE_SIZE
        );
    }

    private getPixelsToWalkThisUpdate(delta: number): number {
        const deltaInSeconds = delta / 1000;
        return this.speedPixelsPerSecond * deltaInSeconds;
    }

    private stopMoving(): void {
        this.client.sendStopMoving(this.movementDirection);
        this.playerSprite.stopAnimation(this.movementDirection);
        this.movementDirection = Direction.NONE;
    }

    private isBlockingDirection(direction: Direction): boolean {
        return this.hasBlockingTile(this.tilePosInDirection(direction));
    }

    private tilePosInDirection(direction: Direction): Phaser.Math.Vector2 {
        return this.playerSprite
        .getTilePos()
        .add(GridPhysics.movementDirectionVectors[direction]!);
    }

    private hasBlockingTile(pos: Phaser.Math.Vector2): boolean {
        if (this.hasNoTile(pos)) return true;
        return this.tileMap.layers.some((layer) => {
            const tile = this.tileMap.getTileAt(pos.x, pos.y, false, layer.name);
            return tile && tile.properties.collides;
        });
    }

    private hasNoTile(pos: Phaser.Math.Vector2): boolean {
        return !this.tileMap.layers.some((layer) =>
                                        this.tileMap.hasTileAt(pos.x, pos.y, layer.name));
    }

}

