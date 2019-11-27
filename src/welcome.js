import Register from "./registration";

import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Template from "./template";
import Login from "./login";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <Template />
                <div>
                    <HashRouter>
                        <div>
                            <Route exact path="/" component={Register} />
                            <Route path="/login" component={Login} />
                        </div>
                    </HashRouter>
                </div>
            </div>
        );
    }
}
