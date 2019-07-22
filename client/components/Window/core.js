/*
 * Aquarius UI Core
 */
import React, { Component } from "react";

export class Button extends Component {
    render() {
        let classList = ["aqui-btn"];
        if (this.props.circle) classList.push("circle");
        return (
            <button className={classList.join(" ")} {...this.props}>
                {this.props.children}
            </button>
        );
    }
}

export class Input extends Component {
    handleChange = e => {
        if (this.props.onChange) this.props.onChange();

        // If binding is set, use the parent's context to change the state
        if (this.props.binding && this.props.name) {
            this.props.binding.setState({ [e.target.name]: e.target.value });
        }
    };

    render() {
        let classList = ["aqui-input"];
        return <input className={classList.join(" ")} onChange={this.handleChange} value={this.props.binding.state[this.props.name]} {...this.props} />;
    }

    componentDidMount() {
        let context = this.props.binding;
        if (context) {
            if (!context.state) {
                context.state = {};
            }
            context.setState({ [this.props.name]: this.props.value || "" });
        }
    }
}
