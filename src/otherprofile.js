import React from "react";
import axios from "./axios";
import { FriendshipButton } from "./friendship-button";

export class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        axios
            .get("/api/user/" + this.props.match.params.id)
            .then(({ data }) => {
                if (this.props.match.params.id == data.id) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        firstname: data.user.firstname,
                        lastname: data.user.lastname,
                        imgurl: data.user.image_url,
                        bio: data.user.bio
                    });
                }
            })
            .catch();
    }
    render() {
        return (
            <div className="other">
                <br />
                <h1>
                    {this.state.firstname} {this.state.lastname}
                </h1>
                <br />
                <img className="otherpic" src={this.state.imgurl} />

                <br />
                <p>{this.state.bio}</p>
                <br />
                <FriendshipButton otherId={this.props.match.params.id} />
            </div>
        );
    }
}
