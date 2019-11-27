import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Register from "./registration";

import App from "./app";

let elem = <Welcome />;

if (location.pathname != "/welcome") {
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));
