import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { friendsWannabes, acceptFriendRequest, unfriend } from "./actions";

export function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(state => {
        return (
            state.friends &&
            state.friends.filter(friends => friends.accepted == true)
        );
    });
    const wannaBeFriends = useSelector(state => {
        return (
            state.friends &&
            state.friends.filter(friends => friends.accepted === false)
        );
    });

    useEffect(() => {
        dispatch(friendsWannabes());
    }, []);

    if (!friends) {
        return null;
    }

    return (
        <div>
            <div className="friendsAccepted">
                <div className="cards">
                    <h2
                        style={{
                            paddingLeft: "20px",
                            color: "ivory",
                            marginTop: "20px",
                            marginBottom: "20px"
                        }}
                    >
                        FRIENDS
                    </h2>
                    {friends.map(friend => (
                        <div key={friend.id}>
                            <Link to={`/user/${friend.id}`}>
                                <img
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        marginLeft: "20px",
                                        borderRadius: "100px"
                                    }}
                                    src={friend.image_url}
                                />
                            </Link>
                            <h3
                                style={{
                                    paddingLeft: "20px",
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    color: "ivory"
                                }}
                            >
                                {friend.firstname} {friend.lastname}
                            </h3>
                            <button
                                onClick={() => dispatch(unfriend(friend.id))}
                                style={{
                                    marginLeft: "20px"
                                }}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
                </div>

                <h2
                    style={{
                        paddingLeft: "20px",
                        color: "ivory",
                        marginTop: "20px",
                        marginBottom: "20px",
                        textAlign: "center"
                    }}
                >
                    AWAITING REQUESTS
                </h2>
                <div className="awaiting">
                    {wannaBeFriends.map(friend => (
                        <div className="awaiting" key={friend.id}>
                            <Link to={`/user/${friend.id}`}>
                                <img
                                    style={{
                                        width: "200px",
                                        height: "200px",

                                        marginLeft: "20px",
                                        borderRadius: "100px"
                                    }}
                                    src={friend.image_url}
                                />
                            </Link>
                            <h3
                                style={{
                                    paddingLeft: "20px",
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    color: "ivory"
                                }}
                            >
                                {friend.firstname} {friend.lastname}
                            </h3>
                            <button
                                style={{
                                    marginLeft: "20px"
                                }}
                                onClick={() =>
                                    dispatch(acceptFriendRequest(friend.id))
                                }
                            >
                                Accept
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
