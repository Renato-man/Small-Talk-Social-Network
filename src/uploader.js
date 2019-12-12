import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        console.log("handle change is happening!!");
        console.log("e.target.files[0]: ", e.target.files[0]);
        this.file = e.target.files[0];
    }

    submit() {
        console.log("this.files!!!: ", this.file);
        var fd = new FormData();
        fd.append("file", this.file);
        axios
            .post("/upload", fd)
            .then(({ data }) => {
                console.log("dattttttaaaa: ", data);
                this.props.updateImage(data.imageUrl);
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            });
    }

    componentDidMount() {
        console.log("uploader mounted!!");
        console.log("this.props: ", this.props);
        // this.props.methodinApp("i am a yummy muffin: ");
    }
    render() {
        return (
            <div className="search">
                <input
                    onChange={e => this.handleChange(e)}
                    className="titles"
                    type="file"
                    name="file"
                    value=""
                    accept="image/*"
                />
                <button
                    onClick={e => {
                        e.preventDefault();
                        this.submit();
                    }}
                >
                    UPLOAD
                </button>
            </div>
        );
    }
}
