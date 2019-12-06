import React from "react";
import axios from "./axios";

export class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editingMode: false,
            buttonText: "edit bio.."
        };
        this.handleChange = this.handleChange.bind(this);
        this.showTextArea = this.showTextArea.bind(this);
        this.submitBio = this.submitBio.bind(this);
    }

    componentDidMount() {
        console.log("props in bio editor: ", this.props);
        // if (!this.props.bio) {
        //     console.log("no bio");
        //     this.setState(
        //         {
        //             buttonText: "Add your bio"
        //         },
        //         () => console.log("this.state: ", this.state)
        //     );
        // }
    }

    showTextArea() {
        this.setState({
            editingMode: !this.state.editingMode
        });
    }

    handleChange(e) {
        console.log("e.target.value", e.target.value);

        this.setState({
            bio: e.target.value
        });
    }

    submitBio() {
        axios.post("/bio", this.state).then(({ data }) => {
            console.log("results,", data);
            console.log("this is the proooooops: ", this.props);
            this.props.setBio(data[0].bio);
            this.showTextArea();
        });
        console.log("this state bio: ", this.state.bio);
        if (this.state.bio) {
            this.setState({
                buttonText: "Edit bio"
            });
        } else {
            this.setState({
                buttonText: "Add bio"
            });
        }
    }
    render() {
        let buttonText;
        this.props.bio
            ? (buttonText = "Edit your bio")
            : (buttonText = "Add your bio");
        console.log("buttonText: ", buttonText);
        if (this.state.editingMode) {
            return (
                <div>
                    <h1>Add your bio below..</h1>
                    <textarea
                        name="bio"
                        type="text"
                        defaultValue={this.props.bio}
                        onChange={e => this.handleChange(e)}
                    />
                    <button onClick={this.submitBio}>Save</button>
                </div>
            );
        } else {
            return (
                <div>
                    <p>{this.props.bio}</p>
                    <button onClick={e => this.showTextArea(e)}>
                        {this.state.buttonText}
                    </button>
                </div>
            );
        }
    }
}
