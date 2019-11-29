import React from "react";

export function ProfilePic({ firstname, lastname, imgurl, toggleFunction }) {
    console.log("this is props in PP: ", firstname);
    console.log(imgurl);
    imgurl = imgurl || "/default.png";

    return (
        <div>
            <img onClick={toggleFunction} src={imgurl} />
            <h2>
                {firstname} {lastname}
            </h2>
        </div>
    );
}
