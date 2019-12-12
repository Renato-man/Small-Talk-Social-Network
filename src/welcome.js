import Register from "./registration";
import Loginheader from "./loginheader";
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
            <div className="app">
                <div className="overlay">
                    <HashRouter>
                        <Loginheader />
                        <div className="welcome">
                            <Route exact path="/" component={Register} />
                            <Route path="/login" component={Login} />
                        </div>
                    </HashRouter>
                </div>
            </div>
        );
    }
}
