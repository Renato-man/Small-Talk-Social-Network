import React, { useState, useEffect } from "react";
import axios from "./axios";

import { ProfilePic } from "./profile-pic";

export function FindPeople() {
    const [newestUser, setNewestUser] = useState([]);
    const [searchUser, setSearchUser] = useState();

    useEffect(() => {
        if (newestUser.length === 0) {
            axios.get("/find").then(({ data }) => {
                console.log("data...... :", data);
                setNewestUser(data);
            });
            return;
        }
        console.log(searchUser);
        if (searchUser == "") {
            setNewestUser([]);
            return;
        }
        axios.get("/findpeople/" + searchUser).then(({ data }) => {
            console.log("data :", data);
            setNewestUser(data);
        });
        console.log("it worked:");
    }, [searchUser]);

    return (
        <div>
            {newestUser &&
                newestUser.map(socialusers => {
                    return (
                        <div key={socialusers.id}>
                            <ProfilePic
                                key={socialusers.id}
                                imgurl={socialusers.image_url}
                                firstname={socialusers.firstname}
                                lastname={socialusers.lastname}
                            />
                        </div>
                    );
                })}

            <input onChange={e => setSearchUser(e.target.value)}></input>
            <button>SEARCH</button>
        </div>
    );
}
