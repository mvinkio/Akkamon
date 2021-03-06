# What is the essence of an MMO?

* Let a lot of players move at the same time in the world
* Let a lot of players make interactions with each other at the same time
* A game

> A game where a lot of things happen at once, and where there is a lot of communication between the backend and frontend.

# Stack

* A game:                 [Phaser3, een javascript/typescript framework](https://phaser.io/phaser3)
* A lot of communication:        Websockets met [Jetty](https://en.wikipedia.org/wiki/Jetty_(web_server)) en [Javascript](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
* Doing a lot of things at once:     [Java Akka](https://doc.akka.io/docs/akka/current/typed/interaction-patterns.html#interaction-patterns), [Java Akka Docs](https://doc.akka.io/api/akka/current/akka/actor/typed/javadsl/index.html), strongly typed actor systeem

## Overview diagram

DISCLAIMER: Don't take this overview as absolute truth, but as the most important information flows. There are some especially complex (and perhaps unnecessarily complex) interactions in the typescript code that
are not included here.

```
┌────────────────────────────────────────────────────────────────┐
│Phaser3/ typescript                                             │
│                                                                │
│      scene{                            engines/controls/ui{    │
│         create(),                       ...                    │
│         update()                     -/\}                      │
│      }          \                    /                         │
│                  \                  .                          │
│                   \   client{     / |                          │
│                    .-->   update(), /                          │
│                           incoming()                           │
│                           send()    .                          │
│                       }      |     /|\                         │
│                             \|/     |                          │
│                              .      | *to incoming*            │
│                       socket{       |                          │
│                           send(),   |                          │
│                           onmessage()                          │
│                       }                                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                             |      .
                             |     /|\
                            \|/     |
                             .      |
                        ┌───────────────┐
                        │AkkamonSession/│
                        │Websocket      │
                        └───────────────┘
                             |      |
                             |      |
 Map<SceneId,   -----------> .      . <- Map<TrainerID, AkkamonSession/Websocket>
Set<AkkamonSession           |      |
/Websocket>>                 |      |
                           ┌─────────┐
                           │Messaging│
                           │Engine   │
                           └─────────┘
            * Requests      |        .   * HeartBeats
            * HeartBeat    \|/      /|\  * Responses to Requests
              pongs         .        |
┌────────────────────────────────────────────────────────────────┐
│Domain Actors                   ┌─────┐                         │
│                                │Nexus│                         │
│                                └─────┘                         │
│                              /    |                            │
│                             .     .  <- Map<sceneId, actor>    │
│                             |     |                            │
│                        ┌─────┐                                 │
│                        │Scene│    ...                          │
│                        └─────┘                                 │
│                       /   |                                    │
│                      .    .  <- Map<TrainerID, actor>          │
│                      |    |                                    │
│            ┌──────────┐                                        │
│            │  Trainer │   ...                                  │
│            └──────────┘                                        │
└────────────────────────────────────────────────────────────────┘
```
