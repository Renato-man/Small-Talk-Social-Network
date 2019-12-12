import React from "react";
import Template from "./template";
import { ProfilePic } from "./profile-pic";
import Uploader from "./uploader";
import { Profile } from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import { OtherProfile } from "./otherprofile";
import { FindPeople } from "./findpeople.js";
import { Friends } from "./friends";
import { Chat } from "./chat";

import axios from "./axios";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            imgurl: this.imgurl,
            bio: this.bio,
            setBio: this.setBio,
            uploaderIsVisible: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    otherProfile() {
        this.setState({
            firstname: this.firstname,
            lastname: this.lastname,
            bio: this.bio
        });
    }

    setBio(bio) {
        this.setState({
            bio: bio
        });
    }
    updateImage(r) {
        this.setState({ imgurl: r });
    }
    componentDidMount() {
        var me = this;
        axios.get("/getUser").then(function(response) {
            me.setState({
                firstname: response.data.firstname,
                lastname: response.data.lastname,
                imgurl: response.data.image_url,
                id: response.data.id,
                bio: response.data.bio
            });
        });
    }
    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }
    methodinApp(muffin) {
        this.state({
            imgurl: muffin
        });
    }
    render() {
        if (!this.state.firstname) {
            return null;
        }
        return (
            <div className="app">
                <BrowserRouter>
                    <div>
                        <Template
                            firstname={this.state.firstname}
                            lastname={this.state.lastname}
                            imgurl={this.state.imgurl}
                            toggleFunction={this.toggleModal.bind(this)}
                        />
                        <div className="route">
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        firstname={this.state.firstname}
                                        lastname={this.state.lastname}
                                        imgurl={this.state.imgurl}
                                        bio={this.state.bio}
                                        toggleFunction={this.toggleModal.bind(
                                            this
                                        )}
                                        setBio={this.setBio}
                                    />
                                )}
                            />
                            <Route path="/user/:id" component={OtherProfile} />
                            <Route path="/users" component={FindPeople} />
                            <Route path="/friends" component={Friends} />
                            <Route path="/chat" component={Chat} />
                        </div>
                    </div>
                </BrowserRouter>

                {this.state.uploaderIsVisible && (
                    <Uploader updateImage={this.updateImage} />
                )}
            </div>
        );
    }
}
