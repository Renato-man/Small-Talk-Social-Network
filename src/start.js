import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import * as io from "socket.io-client";
import { init } from "./socket";
// import Register from "./registration";

import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { Provider } from "react-redux";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

import App from "./app";

const socket = io.connect();

let elem = <Welcome />;

if (location.pathname != "/welcome") {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
