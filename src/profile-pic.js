import React from "react";

export function ProfilePic({
    firstname,
    lastname,
    imgurl,
    toggleFunction,
    profilePicClass = "pp"
}) {
    console.log("this is props in PP: ", firstname);
    console.log("this is lastname is props in pp:", lastname);
    console.log(imgurl);
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
