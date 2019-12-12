import axios from "./axios";

export async function friendsWannabes() {
    try {
        const { data } = await axios.get("/friends-wannabes");
        console.log("friends: ", data);
        return {
            type: "RECEIVE_FRIENDS",
            friends: data
        };
    } catch (err) {
        console.log("err in friendswannabes...", err);
    }
}

export async function acceptFriendRequest(id) {
    try {
        await axios.post("/accept-friend-request/" + id);
        const { data } = await axios.get("/friends-wannabes");
        return {
            type: "ACCEPT_FRIENDS",
            friends: data
        };
    } catch (e) {
        console.log("err in accept-friendship", e);
    }
}

export async function unfriend(id) {
    try {
        await axios.post("/deleteFriendship/" + id);
        const { data } = await axios.get("/friends-wannabes");
        return {
            type: "DELETE_FRIENDS",
            friends: data
        };
    } catch (err) {
        console.log("err in end-friendship", err);
    }
}

export function chatMessages(msg) {
    return {
        type: "MESSAGES",
        msg
    };
}

export function chatMessage(msg) {
    return {
        type: "CHAT",
        msg
    };
}
