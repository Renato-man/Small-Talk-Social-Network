import React, { useState, useEffect } from "react";
import axios from "./axios";

export function FriendshipButton({ otherId }) {
    const [buttonText, setButtonText] = useState("Send Friend Request");

    useEffect(() => {
        console.log("button ,,,,nnm,jfdtghfgkujvhcjdtsrdtfzgmounted", otherId);
        axios
            .get(`/friendshipStatus/${otherId}`)
            .then(resp => {
                console.log("resp: ", resp.data);
                setButtonText(resp.data.buttontext);
            })
            .catch(err => {
                console.log("err:", err);
            });
    }, []);

    function submit() {
        console.log("clicked on the button: ", buttonText, otherId);
        if (buttonText == "Send Friend Request") {
            try {
                axios
                    .post(`/send-friend-request/${otherId}`)
                    .then(({ data }) => {
                        // console.log("dataaaaaaaaaaaa: ", data);
                        setButtonText(data.buttontext);
                    })
                    .catch(err => {
                        console.log("error in post friend request", err);
                    });
            } catch (err) {
                console.log(err);
            }
        }
        // console.log("this is the button text:", buttonText);
        if (buttonText == "Accept Friend Request") {
            console.log("im in the if block ");
            try {
                axios
                    .post(`/accept-friend-request/${otherId}`)
                    .then(({ data }) => {
                        console.log("data in accpet ", data);
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
            console.log("this is the button teeeeeeext:", buttonText);
            try {
                axios
                    .post(`/deleteFriendship/${otherId}`)
                    .then(({ data }) => {
                        console.log("data in accpet ", data);
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
