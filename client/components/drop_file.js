import React, { Component } from "react";

class DropFile extends Component {
    state = {
        drag: false
    };
    dropRef = React.createRef();
    inputRef = React.createRef();
    handleDrag = e => {
        e.preventDefault();
        e.stopPropagation();
    };
    handleDragIn = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ drag: true });
    };
    handleDragOut = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ drag: false });
    };
    handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ drag: false });
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.props.handleDrop(e.dataTransfer.files);
            e.dataTransfer.clearData();
            this.dragCounter = 0;
        }
    };
    componentDidMount() {
        let div = this.dropRef.current;
        div.addEventListener("dragenter", this.handleDragIn);
        div.addEventListener("dragleave", this.handleDragOut);
        div.addEventListener("dragover", this.handleDrag);
        div.addEventListener("drop", this.handleDrop);
        let input = this.inputRef.current;
        input.addEventListener("input", this.handleInput);
    }
    componentWillUnmount() {
        let div = this.dropRef.current;
        div.removeEventListener("dragenter", this.handleDragIn);
        div.removeEventListener("dragleave", this.handleDragOut);
        div.removeEventListener("dragover", this.handleDrag);
        div.removeEventListener("drop", this.handleDrop);
        let input = this.inputRef.current;
        input.removeEventListener("input", this.handleInput);
    }
    handleClick = e => {
        if (!this.props.clickToSelect) return;
        this.inputRef.current.click();
    };
    handleInput = e => {
        if (e.target.files && e.target.files.length > 0) {
            this.props.handleDrop(e.target.files);
        }
    };
    render() {
        return (
            <div
                className={this.props.clickToSelect ? "drop-file-clickable" : null}
                style={this.props.style}
                ref={this.dropRef}
                onClick={this.handleClick}
            >
                <input ref={this.inputRef} type="file" style={{ display: "none" }} />
                {this.state.dragging && (
                    <div
                        style={{
                            border: "dashed grey 4px",
                            backgroundColor: "rgba(255,255,255,.8)",
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 9999
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: 0,
                                left: 0,
                                textAlign: "center",
                                color: "grey",
                                fontSize: 36
                            }}
                        >
                            <div>drop here :)</div>
                        </div>
                    </div>
                )}
                {this.props.children}
            </div>
        );
    }
}

export default DropFile;
