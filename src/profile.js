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
    // console.log("props in profile: ", props);
    return (
        <div className={profilePicClass}>
            <h2 className="nameHeader">
                {firstname} {lastname}
            </h2>
            <ProfilePic
                profilePicClass="big"
                firstname={firstname}
                lastname={lastname}
                imgurl={imgurl}
                toggleFunction={toggleFunction}
            />
            <BioEditor setBio={setBio} bio={bio} />
        </div>
    );
}
