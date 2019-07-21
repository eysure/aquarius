import React from "react";

export default function(props) {
    let classList = ["panel-item"];
    if (props.onClick) classList.push("button");
    if (props.className) classList = [...classList, props.className];

    return (
        <div
            className={classList.join(" ")}
            style={{ gridColumn: props.span ? `span ${props.span}` : "span 12", ...props.containerStyle }}
            onClick={props.onClick}
        >
            <div className="panel-item-title" style={{ ...props.titleStyle }}>
                {props.title}
            </div>
            {props.input ? (
                <input
                    className="panel-item-value"
                    style={{ ...props.valueStyle }}
                    onChange={props.onChange}
                    value={props.value}
                    name={props.name}
                    type={props.type}
                />
            ) : (
                <div className="panel-item-value" style={{ ...props.valueStyle }}>
                    {props.titleIcon || props.onClick ? <i className="material-icons">open_in_new</i> : ""}
                    {props.value}
                </div>
            )}
        </div>
    );
}
