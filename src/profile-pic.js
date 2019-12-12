import React from "react";

export function ProfilePic({
    firstname,
    lastname,
    imgurl,
    toggleFunction,
    profilePicClass = "pp"
}) {
    imgurl = imgurl || "/default.png";

    return (
        <div className={profilePicClass}>
            <h4>
                {firstname} {lastname}
            </h4>
            <img onClick={toggleFunction} src={imgurl} />
            <h2 className="nameHeader"></h2>
        </div>
    );
}
