import React from "react";
import { Tooltip } from "@material-ui/core";
import { animate } from "../../utils";

export default class DockItem extends React.Component {
    state = {};

    dockItemRef = React.createRef();
    dockItemIndicatorRef = React.createRef();

    onClick = e => {
        this.props.onClick();
    };

    onContextMenu = e => {
        console.log("TODO: DockItem context Menu");
    };

    render() {
        return (
            <Tooltip title={this.props.title} placement="top">
                <div id={this.props.id} className="dock-item" onClick={this.onClick} onContextMenu={this.onContextMenu}>
                    <img ref={this.dockItemRef} className="dock-item-image" src={this.props.img} />
                    <div className="dock-item-indicator" ref={this.dockItemIndicatorRef} style={{ opacity: this.props.open ? 1 : 0 }} />
                </div>
            </Tooltip>
        );
    }

    componentDidMount() {
        let item = this.dockItemRef.current;
        if (!item) return;
        animate(item, null, "dock-item-enter");
        if (this.props.open) {
            let indicator = this.dockItemIndicatorRef.current;
            if (!indicator) return;
            animate(indicator, null, "animated", "fadeIn", "slow");
        }
    }
}
