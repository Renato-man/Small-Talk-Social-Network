import React from "react";
import Template from "./template";
import { ProfilePic } from "./profile-pic";
import Uploader from "./uploader";
import { Profile } from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import { OtherProfile } from "./otherprofile";
import { FindPeople } from "./findpeople.js";

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
        console.log("rrrrr: ", r);
    }
    componentDidMount() {
        console.log("app has mounted: ");
        var me = this;
        axios.get("/getUser").then(function(response) {
            console.log("response from images: ", response.data);
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
        console.log("toggle modal is running!!");

        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }
    methodinApp(muffin) {
        console.log("i am a method in app");
        console.log("muffin: ", muffin);
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
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    firstname={this.state.firstname}
                                    lastname={this.state.lastname}
                                    imgurl={this.state.imgurl}
                                    // updateBio={this.updateBio.bind(this)}
                                    bio={this.state.bio}
                                    toggleFunction={this.toggleModal.bind(this)}
                                    setBio={this.setBio}
                                />
                            )}
                        />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route path="/users" component={FindPeople} />
                    </div>
                </BrowserRouter>

                {this.state.uploaderIsVisible && (
                    <Uploader updateImage={this.updateImage} />
                )}
            </div>
        );
    }
}
