import React from "react";
import { oss } from "../utils";

export default function(props) {
    if (!props.user) {
        console.error("Avatar: no user provided");
        return null;
    }
    return (
        <img
            alt={props.user.nickname || "avatar"}
            style={{
                borderRadius: props.round ? "50%" : "6px",
                width: props.d || "auto",
                height: props.d || "auto",
                ...props.style
            }}
            src={oss(`assets/user/avatar/${props.user.avatar || "default"}`)}
        />
    );
}
