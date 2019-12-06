import React from "react";
import { ProfilePic } from "./profile-pic";

export default class Template extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="header">
                <h1 className="logo">LOGO</h1>
                <div>
                    <ProfilePic
                        profilePicClass="small"
                        imgurl={this.props.imgurl}
                        toggleFunction={this.props.toggleFunction}
                    />
                </div>
            </div>
        );
    }
}
