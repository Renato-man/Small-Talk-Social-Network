import React from "react";
import { ProfilePic } from "./profile-pic";

export default class Template extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <h1> WELCOME TO MY SOCIAL PLATFORM </h1>
            </div>
        );
    }
}
