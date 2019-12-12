import React from "react";
import { ProfilePic } from "./profile-pic";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class Template extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.logout = this.logout.bind(this);
    }

    logout() {
        axios.post("/logout").then(function() {
            location.replace("/welcome");
        });
    }

    render() {
        return (
            <div className="header">
                <h1 className="logo">LOGO</h1>
                <h3 className="nav">
                    <Link to="/users" className="l">
                        FIND FRIENDS
                    </Link>

                    <Link to="/friends" className="l">
                        FRIENDS
                    </Link>

                    <Link to="/" className="l">
                        PROFILE
                    </Link>

                    <Link to="/chat" className="l">
                        CHAT
                    </Link>
                </h3>
                <button
                    className="t"
                    style={{ height: "10px", marginBottom: "70px" }}
                    onClick={this.logout}
                >
                    LOGOUT
                </button>
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
