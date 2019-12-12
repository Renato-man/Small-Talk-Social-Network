import React from "react";
import { ProfilePic } from "./profile-pic";
import { BioEditor } from "./bio-editor";

export function Profile({
    profilePicClass,
    firstname,
    lastname,
    bio,
    imgurl,
    toggleFunction,
    setBio
}) {
    return (
        <div className={profilePicClass}>
            <div className="welcome1">
                <h2 className="nameHeader">
                    {firstname} {lastname}
                </h2>
                <br />
                <br />
                <ProfilePic
                    profilePicClass="big"
                    imgurl={imgurl}
                    toggleFunction={toggleFunction}
                />
                <br />

                <BioEditor setBio={setBio} bio={bio} />
            </div>
        </div>
    );
}
