import React from "react";

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
            <div>
                <div className="welcome">
                    {this.state.error && <div className="error">Oops!</div>}
                    <h3 className="t">LOGIN</h3>
                    <br />
                    <br />
                    <form>
                        <h3 className="o">Email</h3>
                        <br />
                        <input
                            type="email"
                            name="email"
                            onChange={e => this.handleChange(e.target)}
                        />
                        <br />
                        <br />
                        <h3 className="o">Password</h3>

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
                    </form>
                    <h3>
                        <Link className="reglink" to="/">
                            Take me to registration!
                        </Link>
                    </h3>
                    <br />
                    <br />
                </div>
            </div>
        );
    }
}
