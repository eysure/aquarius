import React from "react";

export default function spinner(props) {
    let blades = [];
    for (let i = 0; i < 12; i++) {
        blades.push(<div key={i} />);
    }
    return (
        <div className="spinner" style={props.style}>
            {blades}
        </div>
    );
}
