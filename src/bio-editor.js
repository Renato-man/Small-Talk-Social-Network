import React from "react";
import axios from "./axios";

export class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editingMode: false,
            buttonText: "EDIT BIO.."
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
        this.setState({
            bio: e.target.value
        });
    }

    submitBio() {
        axios.post("/bio", this.state).then(({ data }) => {
            this.props.setBio(data[0].bio);
            this.showTextArea();
        });
        if (this.state.bio) {
            this.setState({
                buttonText: "EDIT BIO"
            });
        } else {
            this.setState({
                buttonText: "ADD BIO"
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
                    <h3>Add your bio below..</h3>

                    <textarea
                        name="bio"
                        type="text"
                        defaultValue={this.props.bio}
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <br />
                    <button className="m" onClick={this.submitBio}>
                        SAVE
                    </button>
                </div>
            );
        } else {
            return (
                <div>
                    <h3>{this.props.bio}</h3>
                    <br />
                    <br />
                    <button className="m" onClick={e => this.showTextArea(e)}>
                        {this.state.buttonText}
                    </button>
                </div>
            );
        }
    }
}
