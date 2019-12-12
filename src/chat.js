import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { ProfilePic } from "./profile-pic";
import { Link } from "react-router-dom";

export function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector(state => state && state.messages);

    useEffect(() => {
        socket.emit("load");
    }, []);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = e => {
        if (e.key === "Enter") {
            socket.emit("My amazing chat message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="welcome1">
            <h1>Chat Room</h1>
            <br />
            <br />
            <div className="chat-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map(socialusers => {
                        return (
                            <div key={socialusers.id}>
                                <Link
                                    to={`/user/${socialusers.sender_id}`}
                                    className="send"
                                >
                                    <div className="u"></div>
                                    <br />
                                    <div className="p">
                                        <ProfilePic
                                            key={socialusers.id}
                                            imgurl={socialusers.image_url}
                                            firstname={socialusers.firstname}
                                            lastname={socialusers.lastname}
                                        />
                                    </div>
                                </Link>
                                <br />
                                <p className="ppp">{socialusers.msg}</p>
                                <br />
                            </div>
                        );
                    })}
            </div>
            <textarea
                placeholder="add your message here"
                onKeyUp={keyCheck}
            ></textarea>
        </div>
    );
}
