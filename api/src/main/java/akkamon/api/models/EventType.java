package akkamon.api.models;

import com.google.gson.annotations.SerializedName;

public enum EventType {
    @SerializedName("TrainerRegistrationRequestEvent")
    TRAINER_REGISTRATION_REQUEST,

    @SerializedName("TrainerRegistrationReplyEvent")
    TRAINER_REGISTRATION_REPLY,

    @SerializedName("HeartBeat")
    HEART_BEAT,

    @SerializedName("StartMoving")
    START_MOVING,

    @SerializedName("NewTilePos")
    NEW_TILE_POS,

    @SerializedName("StopMoving")
    STOP_MOVING,

    @SerializedName("SocketClosed")
    SOCKET_CLOSED,

    @SerializedName("InteractionRequestEvent")
    INTERACTION_REQUEST,

    @SerializedName("InteractionReplyEvent")
    INTERACTION_REPLY,

    @SerializedName("InteractionStarting")
    INTERACTION_START,

    @SerializedName("BattleInitEvent")
    BATTLE_INIT,

    @SerializedName("BattleActionRequest")
    BATTLE_ACTION_REQUEST,

}
