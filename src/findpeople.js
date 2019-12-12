import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { ProfilePic } from "./profile-pic";
import { FriendshipButton } from "./friendship-button";

export function FindPeople() {
    const [newestUser, setNewestUser] = useState([]);
    const [searchUser, setSearchUser] = useState();

    useEffect(() => {
        if (newestUser.length === 0) {
            axios.get("/find").then(({ data }) => {
                setNewestUser(data);
            });
            return;
        }
        if (searchUser == "") {
            setNewestUser([]);
            return;
        }
        axios.get("/findpeople/" + searchUser).then(({ data }) => {
            setNewestUser(data);
        });
    }, [searchUser]);

    return (
        <div className="app">
            <div className="in">
                <input onChange={e => setSearchUser(e.target.value)}></input>
                <button>SEARCH</button>
            </div>
            {newestUser &&
                newestUser.map(socialusers => {
                    return (
                        <div className="find-container" key={socialusers.id}>
                            <div className="header-space"></div>
                            <div className="find">
                                <Link to={`/user/${socialusers.id}`}>
                                    <br />
                                    <ProfilePic
                                        key={socialusers.id}
                                        imgurl={socialusers.image_url}
                                    />
                                    <h3>
                                        {socialusers.firstname} {""}
                                        {socialusers.lastname}
                                    </h3>
                                </Link>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
