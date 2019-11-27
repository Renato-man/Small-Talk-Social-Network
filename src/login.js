import React from "react";

// import Template from "./template";
import axios from "./axios";

import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    console.log("dattttttaaaa: ", data);
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            });
    }
    handleChange(inputElement) {
        this.setState({
            [inputElement.name]: inputElement.value
        });
    }
    render() {
        return (
            <div>
                {this.state.error && <div className="error">Oops!</div>}
                <h1>I am login!!!</h1>
                <form>
                    <h3>Email</h3>
                    <input
                        type="email"
                        name="email"
                        onChange={e => this.handleChange(e.target)}
                    />
                    <h3>Password</h3>
                    <input
                        type="password"
                        name="password"
                        onChange={e => this.handleChange(e.target)}
                    />
                    <button
                        onClick={e => {
                            e.preventDefault();
                            this.submit();
                        }}
                    >
                        Submit
                    </button>
                </form>
                <Link to="/">Take me to registration!</Link>
            </div>
        );
    }
}
