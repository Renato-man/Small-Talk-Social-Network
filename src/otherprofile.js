import React from "react";
import axios from "./axios";
import { FriendshipButton } from "./friendship-button";

export class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        console.log("this.props.match: ", this.props.match);
        console.log("this.props.match.params.id: ", this.props.match.params.id);
        axios
            .get("/api/user/" + this.props.match.params.id)
            .then(({ data }) => {
                console.log("responseeeeeeeeee:", data);
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
                <h1>
                    {this.state.firstname} {this.state.lastname}
                </h1>
                <br />
                <img className="otherpic" src={this.state.imgurl} />
                <FriendshipButton otherId={this.props.match.params.id} />
                <br />
                <p>{this.state.bio}</p>
            </div>
        );
    }
}
