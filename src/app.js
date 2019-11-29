import React from "react";
import Template from "./template";
import { ProfilePic } from "./profile-pic";
import Uploader from "./uploader";

import axios from "./axios";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            firstname: this.firstname,
            lastname: this.lastname,
            imgurl: this.imgurl,
            uploaderIsVisible: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.updateImage = this.updateImage.bind(this);
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
            // me.images = response.data;
            // console.log("response after upload: ", response.data);
            me.setState({
                firstname: response.data.firstname,
                lastname: response.data.lastname,
                imgurl: response.data.image_url
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
        return (
            <div>
                <Template />
                <ProfilePic
                    toggleFunction={this.toggleModal.bind(this)}
                    firstname={this.state.firstname}
                    lastname={this.state.lastname}
                    imgurl={this.state.imgurl}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader updateImage={this.updateImage} />
                )}
            </div>
        );
    }
}
