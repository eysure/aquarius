import React from "react";

export default function(props) {
    return (
        <div
            className={`panel-item ${props.onClick && "button"} ${props.className}`}
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
                    {props.titleIcon}
                    {props.value}
                </div>
            )}
        </div>
    );
}
