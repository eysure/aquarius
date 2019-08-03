/*
 * Aquarius UI Core
 */
import React, { Component } from "react";
import { isUndefined } from "util";

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
        // If binding is set, use the parent's context to change the state
        if (this.props.binding && this.props.name) {
            this.props.binding.setState({ [e.target.name]: e.target.value });
        }

        if (this.props.onChange) this.props.onChange(e);
    };

    render() {
        let classList = ["aqui-input"];
        return (
            <input
                className={classList.join(" ")}
                value={this.props.binding && this.props.binding.state[this.props.name]}
                {...this.props}
                onChange={this.handleChange}
            />
        );
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

export class InputItem extends Component {
    renderSelect = () => {
        let options = this.props.options;
        if (Array.isArray(options)) {
            return options.map(key => {
                return (
                    <option key={key} value={key}>
                        {key}
                    </option>
                );
            });
        } else {
            return Object.keys(options).map(key => {
                return (
                    <option key={key} value={key}>
                        {options[key]}
                    </option>
                );
            });
        }
    };

    render() {
        if (this.props.type === "checkbox") {
            let classList = ["aqui-checkbox"];
            if (this.props.value === true) {
                classList.push("checked");
            } else if (this.props.value === "") {
                classList.push("intermediate");
            } else classList.push("unchecked");
            if (this.props.disabled) {
                classList.push("disabled");
            }
            return (
                <div id={`${this.props.name}-input-item`} className="aqui-input-item vcs" style={{ width: this.props.width || "100%" }}>
                    <div
                        className="aqui-checkbox-container"
                        onClick={e => {
                            if (this.props.disabled) return;
                            e.target.name = this.props.name;
                            e.target.value = !this.props.value;
                            this.props.onChange(e);
                        }}
                    >
                        <input id={this.props.name} {...this.props} type="checkbox" style={{ display: "none" }} checked={this.props.value} />
                        <div className={classList.join(" ")} />
                        <div className="aqui-input-title aqui-checkbox-label">{this.props.label || this.props.title}</div>
                    </div>
                    {this.props.caption && <span className="aqui-input-caption">{this.props.caption}</span>}
                </div>
            );
        }
        return (
            <div id={`${this.props.name}-input-item`} className="aqui-input-item vss" style={{ width: this.props.width || "100%" }}>
                {this.props.title && <div className="hsc aqui-input-title">{this.props.title}</div>}
                {!this.props.options && <input id={this.props.name} {...this.props} />}
                {this.props.options && (
                    <select id={this.props.name} {...this.props}>
                        <option value={""} disabled>
                            {this.props.placeholder || ""}
                        </option>
                        {this.renderSelect()}
                    </select>
                )}
                {this.props.caption && <span className="aqui-input-caption">{this.props.caption}</span>}
            </div>
        );
    }
}

export class FieldItem extends Component {
    fields = null;
    state = null;
    name = null;
    field = null;

    calculateConditions = (name, conditions) => {
        if (!conditions) {
            console.error("Conditions cannot found during calculate conditions, false has been returned.");
            return false;
        }

        let res = true;
        for (let and_con in conditions) {
            if (and_con === "$or") {
                let subres = false;
                for (let or_con in conditions["$or"]) {
                    subres |= this.calculateSingleCondition(name, or_con, conditions["$or"][or_con]);
                }
                res &= subres;
            } else {
                res &= this.calculateSingleCondition(name, and_con, conditions[and_con]);
            }
        }
        return res;
    };

    calculateSingleCondition = (name, key, val) => {
        if (key === "$regex") {
            let res = val.exec(this.state[name]);
            return res ? true : false;
        } else if (key === "$func") {
            return val(this.state[name]);
        } else if (key === "$eq") {
            if (this.state[val] === undefined) {
                throw new Error(
                    `Exception when calculate single condition. When compare state.${name} and state.${val}, state.${val} is not exist in the state, maybe a typo, or not set.`
                );
            }
            return this.state[name] === this.state[val];
        } else if (this.state[key] !== undefined) {
            if (val === "$valid") return this.calculateValid(key);
            else if (val === "$!valid") return !this.calculateValid(key);
            else if (val === "$disabled") return this.calculateDisable(key);
            else if (val === "$!disabled") return !this.calculateDisable(key);
            else return this.state[key] === val;
        } else {
            console.error(
                `Exception when calculate single condition. key: "${key}" is not recognized, only $regex or specific field is valid. False is returned.`
            );
            return false;
        }
    };

    calculateValid = name => {
        if (this.fields[name].valid === undefined) return true;
        return this.calculateConditions(name, this.fields[name].valid);
    };

    calculateDisable = name => {
        if (this.state.processing) return true;
        if (this.fields[name].disabled === true) return true;
        if (!this.fields[name].disabled) return false;
        return this.calculateConditions(name, this.fields[name].disabled);
    };

    onChange = e => {
        if (!e) return;
        e.preventDefault();
        this.props.context.setState({ [e.target.name]: e.target.value });
    };

    renderSelect = () => {
        let options = this.field.options;
        if (Array.isArray(options)) {
            return options.map(key => {
                return (
                    <option key={key} value={key}>
                        {key}
                    </option>
                );
            });
        } else {
            return Object.keys(options).map(key => {
                return (
                    <option key={key} value={key}>
                        {options[key]}
                    </option>
                );
            });
        }
    };

    render() {
        if (!this.props.name) throw new Error("Props: name is not set for this FieldItem");
        if (!this.props.context) throw new Error("Props: context is not set for this Field Item.");

        this.fields = this.props.context.fields;
        this.state = this.props.context.state;
        this.name = this.props.name;
        this.field = this.fields[this.name];

        let { fields, state, name, field } = this;

        if (!fields) throw new Error(`This FieldItem ${name} has no fields set. Check the parent class and set the fields.`);
        if (!state) throw new Error(`State of this FieldItem "${name}" is not set.`);
        if (!field) throw new Error(`Cannot find field in fields of parent of this FieldItem "${name}". Maybe a typo in name or fields, or not set.`);

        let disabled = this.calculateDisable(name);
        let valid = this.calculateValid(name);

        switch (field.type) {
            case "checkbox": {
                let classList = ["aqui-checkbox"];
                if (state[name] === true) classList.push("checked");
                else if (state[name] === "") classList.push("intermediate");
                else classList.push("unchecked");
                if (disabled) classList.push("disabled");

                return (
                    <div id={`${name}-input-item`} className="aqui-input-item vcs" style={{ width: this.props.width || "100%" }}>
                        <div
                            className="aqui-checkbox-container"
                            onClick={e => {
                                if (disabled) return;
                                e.target.name = name;
                                e.target.value = !state[name];
                                this.onChange(e);
                            }}
                        >
                            <input id={name} type="checkbox" style={{ display: "none" }} checked={state[name]} disabled={disabled} onChange={this.onChange} />
                            <div className={classList.join(" ")} />
                            <div className="aqui-input-title aqui-checkbox-label">{field.title}</div>
                        </div>
                        {field.caption && <span className="aqui-input-caption">{field.caption}</span>}
                    </div>
                );
            }
            case "select": {
                return (
                    <div id={`${name}-input-item`} className="aqui-input-item vss" style={{ width: this.props.width || "100%" }}>
                        {field.title && <div className="hsc aqui-input-title">{field.title}</div>}
                        <select id={name} name={name} value={state[name]} onChange={this.onChange} disabled={disabled}>
                            <option value={""} disabled>
                                {field.placeholder || "Please Select"}
                            </option>
                            {this.renderSelect()}
                        </select>
                        {this.props.caption && <span className="aqui-input-caption">{this.props.caption}</span>}
                    </div>
                );
            }
            case "button": {
                let classList = ["aqui-btn"];
                if (this.props.transparent) classList.push("transparent");
                return (
                    <button className={classList.join(" ")} onClick={this.props.onClick || this.field.onClick} disabled={disabled} style={this.props.style}>
                        {field.title}
                    </button>
                );
            }
            default: {
                if (state[name] === undefined)
                    throw new Error(`Cannot find name in state of parent of this FieldItem "${name}". Check the parent class's state.`);
                return (
                    <div id={`${name}-input-item`} className="aqui-input-item vss" style={{ width: this.props.width || "100%" }}>
                        {(this.props.title || field.title) && <div className="hsc aqui-input-title">{this.props.title || field.title}</div>}
                        <input
                            id={name}
                            name={name}
                            value={state[name]}
                            type={field.type || "text"}
                            onChange={this.onChange}
                            disabled={disabled}
                            placeholder={this.props.placeholder || field.placeholder}
                        />
                        {field.caption && <span className="aqui-input-caption">{field.caption}</span>}
                    </div>
                );
            }
        }
    }
}

export class InputGroup extends Component {
    render() {
        return <div className="aqui-input-group hbs h-full">{this.props.children}</div>;
    }
}
