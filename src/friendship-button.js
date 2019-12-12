import React, { useState, useEffect } from "react";
import axios from "./axios";

export function FriendshipButton({ otherId }) {
    const [buttonText, setButtonText] = useState("Send Friend Request");

    useEffect(() => {
        axios
            .get(`/friendshipStatus/${otherId}`)
            .then(resp => {
                setButtonText(resp.data.buttontext);
            })
            .catch(err => {
                console.log("err:", err);
            });
    }, []);

    function submit() {
        if (buttonText == "Send Friend Request") {
            try {
                axios
                    .post(`/send-friend-request/${otherId}`)
                    .then(({ data }) => {
                        setButtonText(data.buttontext);
                    })
                    .catch(err => {
                        console.log("error in post friend request", err);
                    });
            } catch (err) {
                console.log(err);
            }
        }
        if (buttonText == "Accept Friend Request") {
            try {
                axios
                    .post(`/accept-friend-request/${otherId}`)
                    .then(({ data }) => {
                        setButtonText(data.buttontext);
                    })
                    .catch(err => {
                        console.log("error in post friend request", err);
                    });
            } catch (err) {
                console.log(err);
            }
        }
        if (buttonText == "Cancel Friend Request" || buttonText == "Unfriend") {
            try {
                axios
                    .post(`/deleteFriendship/${otherId}`)
                    .then(({ data }) => {
                        setButtonText(data.buttontext);
                    })
                    .catch(err => {
                        console.log("error in post friend request", err);
                    });
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <div>
            <button className="btn" onClick={submit}>
                {buttonText}
            </button>
        </div>
    );
}
