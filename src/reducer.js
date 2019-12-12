export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS") {
        state = {
            ...state,
            friends: action.friends
        };
    }

    if (action.type == "ACCEPT_FRIENDS") {
        state = {
            ...state,
            friends: action.friends
        };
    }

    if (action.type == "DELETE_FRIENDS") {
        state = {
            ...state,
            friends: action.friends
        };
    }

    if (action.type === "MESSAGES") {
        state = {
            ...state,
            messages: action.msg
        };
    }

    if (action.type === "CHAT") {
        state = {
            ...state,
            messages: [...state.messages, action.msg]
        };
    }
    return state;
}
