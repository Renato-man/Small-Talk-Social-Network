import React from "react";
import Template from "./template.js";

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
            <div className="app">
                <div className="welcome">
                    {this.state.error && <div className="error">Oops!</div>}

                    <form>
                        <h3 classList="email">EMAIL</h3>
                        <br />
                        <input
                            type="email"
                            name="email"
                            onChange={e => this.handleChange(e.target)}
                        />
                        <br />
                        <br />
                        <h3>PASSWORD</h3>

                        <br />
                        <input
                            type="password"
                            name="password"
                            onChange={e => this.handleChange(e.target)}
                        />
                        <br />
                        <br />
                        <button
                            className="button"
                            onClick={e => {
                                e.preventDefault();
                                this.submit();
                            }}
                        >
                            SUBMIT
                        </button>
                        <br />
                        <br />
                        <Link className="reglink" to="/">
                            Take me to registration!
                        </Link>
                    </form>
                    <br />
                    <br />
                </div>
            </div>
        );
    }
}
