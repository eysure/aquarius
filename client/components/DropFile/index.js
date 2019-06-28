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
        if (this.props.handleDrag) this.props.handleDrag(e);
    };

    handleDragIn = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ drag: true });
        if (this.props.handleDragIn) this.props.handleDragIn(e);
    };

    handleDragOut = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ drag: false });
        if (this.props.handleDragOut) this.props.handleDragOut(e);
    };

    handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ drag: false });
        if (this.props.handleDropRaw) this.props.handleDropRaw(e);
        else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.props.handleDrop(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    componentDidMount() {
        let input = this.inputRef.current;
        input.addEventListener("input", this.handleInput);

        if (this.props.disableDrop) return;
        let div = this.dropRef.current;
        div.addEventListener("dragenter", this.handleDragIn);
        div.addEventListener("dragleave", this.handleDragOut);
        div.addEventListener("dragover", this.handleDrag);
        div.addEventListener("drop", this.handleDrop);
    }

    componentWillUnmount() {
        let input = this.inputRef.current;
        input.removeEventListener("input", this.handleInput);

        if (this.props.disableDrop) return;
        let div = this.dropRef.current;
        div.removeEventListener("dragenter", this.handleDragIn);
        div.removeEventListener("dragleave", this.handleDragOut);
        div.removeEventListener("dragover", this.handleDrag);
        div.removeEventListener("drop", this.handleDrop);
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
        let landingAreaStyle = { opacity: this.state.drag ? 1 : 0 };
        return (
            <div className={this.props.clickToSelect ? "drop-file-clickable" : null} style={this.props.style} ref={this.dropRef} onClick={this.handleClick}>
                <input ref={this.inputRef} type="file" style={{ display: "none" }} multiple={this.props.multiple} />
                {!this.props.disableLandingArea && <div className="drop-file-landing-area" style={{ ...this.props.landingAreaStyle, ...landingAreaStyle }} />}
            </div>
        );
    }
}

export default DropFile;
