/*
 * Aquarius UI Core
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import DropFile from "../DropFile";
import Select from "react-select";
import Fuse from "fuse.js";
import PropTypes from "prop-types";

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

// export class Input extends Component {
//     handleChange = e => {
//         // If binding is set, use the parent's context to change the state
//         if (this.props.binding && this.props.name) {
//             this.props.binding.setState({ [e.target.name]: e.target.value });
//         }

//         if (this.props.onChange) this.props.onChange(e);
//     };

//     render() {
//         let classList = ["aqui-input"];
//         return (
//             <input
//                 className={classList.join(" ")}
//                 value={this.props.binding && this.props.binding.state[this.props.name]}
//                 {...this.props}
//                 onChange={this.handleChange}
//             />
//         );
//     }

//     componentDidMount() {
//         let context = this.props.binding;
//         if (context) {
//             if (!context.state) {
//                 context.state = {};
//             }
//             context.setState({ [this.props.name]: this.props.value || "" });
//         }
//     }
// }

// export class InputItem extends Component {
//     renderSelect = () => {
//         let options = this.props.options;
//         if (Array.isArray(options)) {
//             return options.map(key => {
//                 return (
//                     <option key={key} value={key}>
//                         {key}
//                     </option>
//                 );
//             });
//         } else {
//             return Object.keys(options).map(key => {
//                 return (
//                     <option key={key} value={key}>
//                         {options[key]}
//                     </option>
//                 );
//             });
//         }
//     };

//     render() {
//         if (this.props.type === "checkbox") {
//             let classList = ["aqui-checkbox"];
//             if (this.props.value === true) {
//                 classList.push("checked");
//             } else if (this.props.value === "") {
//                 classList.push("intermediate");
//             } else classList.push("unchecked");
//             if (this.props.disabled) {
//                 classList.push("disabled");
//             }
//             return (
//                 <div id={`${this.props.name}-input-item`} className="aqui-input-item vcs" style={{ width: this.props.width || "100%" }}>
//                     <div
//                         className="aqui-checkbox-container"
//                         onClick={e => {
//                             if (this.props.disabled) return;
//                             e.target.name = this.props.name;
//                             e.target.value = !this.props.value;
//                             this.props.onChange(e);
//                         }}
//                     >
//                         <input id={this.props.name} {...this.props} type="checkbox" style={{ display: "none" }} checked={this.props.value} />
//                         <div className={classList.join(" ")} />
//                         <div className="aqui-input-title aqui-checkbox-label">{this.props.label || this.props.title}</div>
//                     </div>
//                     {this.props.caption && <span className="aqui-input-caption">{this.props.caption}</span>}
//                 </div>
//             );
//         }
//         return (
//             <div id={`${this.props.name}-input-item`} className="aqui-input-item vss" style={{ width: this.props.width || "100%" }}>
//                 {this.props.title && <div className="hsc aqui-input-title">{this.props.title}</div>}
//                 {!this.props.options && <input id={this.props.name} {...this.props} />}
//                 {this.props.options && (
//                     <select id={this.props.name} {...this.props}>
//                         <option value={""} disabled>
//                             {this.props.placeholder || ""}
//                         </option>
//                         {this.renderSelect()}
//                     </select>
//                 )}
//                 {this.props.caption && <span className="aqui-input-caption">{this.props.caption}</span>}
//             </div>
//         );
//     }
// }

export function Spinner(props) {
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

Spinner.propTypes = {
    style: PropTypes.object
};

export class FieldItem extends Component {
    state = {
        rawOptions: [],
        fusedOptions: []
    };

    schema = null;
    parentState = null;
    name = null;
    field = null;

    inputRef = React.createRef();
    textareaRef = React.createRef();

    calculateConditions = (name, conditions) => {
        if (!conditions) {
            console.error("Conditions cannot found during calculate conditions, false has been returned.");
            return false;
        }

        let res = true;
        if (this.field.debug) console.log("conditions:", name);
        for (let and_con in conditions) {
            if (and_con === "$or") {
                if (this.field.debug) console.log("or");
                let subres = false;
                for (let or_con in conditions["$or"]) {
                    subres = subres || this.calculateSingleCondition(name, or_con, conditions["$or"][or_con]);
                    if (this.field.debug) console.log(`\tor subres for "${name}" with single condition:`, subres);
                }
                res = res && subres;
            } else {
                res = res && this.calculateSingleCondition(name, and_con, conditions[and_con]);
            }
        }
        if (this.field.debug) console.log(`final Result for "${name}":`, res);
        return res;
    };

    calculateSingleCondition = (name, key, val) => {
        if (this.field.debug) console.log("single: ", name, key, val);
        if (key === "$regex") {
            let res = val.exec(this.parentState[name]);
            return res ? true : false;
        } else if (key === "$func") {
            return val(this.parentState[name]);
        } else if (key === "$eq") {
            if (val.startsWith("#", 0)) return _.isEqual(this.parentState[name], this.parentState[val.slice(1)]);
            else return _.isEqual(this.parentState[name], val);
        } else if (key === "$neq") {
            if (val.startsWith("#", 0)) return !_.isEqual(this.parentState[name], this.parentState[val.slice(1)]);
            else return !_.isEqual(this.parentState[name], val);
        } else if (key === "$not") {
            if (!_.isObject(val) || Object.keys(val).length > 1) {
                console.error(
                    `Only single condition (object with one key) is acceptable when using "$not" as key. however, ${val} is given. False is returned.`
                );
                return false;
            }
            return !this.calculateSingleCondition(name, Object.keys(val)[0], val[Object.keys(val)[0]]);
        } else if (this.parentState[key] !== undefined) {
            if (val === "$valid") return this.calculateValid(key);
            else if (val === "$!valid") return !this.calculateValid(key);
            else if (val === "$disabled") return this.calculateDisable(key);
            else if (val === "$!disabled") return !this.calculateDisable(key);
            else if (_.isObject(val)) return this.calculateConditions(key, val);
            else return this.parentState[key] === val;
        } else {
            console.error(
                `Exception when calculate single condition. key: "${key}" is not recognized, only $regex or specific field is valid. False is returned.`
            );
            return false;
        }
    };

    calculateValid = name => {
        let field = this.schema[name];

        if (field.type === "select") {
            // When value is not one of the options, return false
            // let options = field.options;
            // if (_.isArray(options)) {
            //     if (!options.includes(this.parentState[name])) return false;
            // } else if (_.isObject(options)) {
            //     if (!Object.keys(options).includes(this.parentState[name])) return false;
            // } else {
            //     return false;
            // }
            if (_.isArray(this.parentState[name]) && field.multi) {
                for (let v of this.parentState[name]) {
                    if (!field.options[v]) return false;
                }
                return true;
            } else if (!_.isArray(this.parentState[name]) && !field.multi) {
                return field.options[this.parentState[name]] !== undefined;
            } else return false;
        }

        if (this.schema[name].valid === undefined) return true;

        return this.calculateConditions(name, this.schema[name].valid);
    };

    calculateDisable = name => {
        if (this.parentState.processing) return true;
        if (this.schema[name].disabled === true) return true;
        if (this.schema[name].disabled === undefined) return false;
        return this.calculateConditions(name, this.schema[name].disabled);
    };

    onChange = (e, name, val) => {
        if (!e) return;
        e.preventDefault();
        this.props.context.setState({ [e.target.name]: e.target.value });
        if (!this.parentState["modified"]) this.props.context.setState({ modified: true });
    };

    onSelectChange = (name, val) => {
        let res = null;
        if (_.isArray(val)) {
            res = [];
            for (let v of val) {
                res.push(v.value);
            }
        } else res = val.value;
        this.props.context.setState({ [name]: res });
        if (!this.parentState["modified"]) this.props.context.setState({ modified: true });
    };

    processSelectValue = (name, parentState, options) => {
        let res = null;
        let value = parentState[name];
        if (value instanceof Mongo.ObjectID) {
            value = value._str;
        }
        if (_.isArray(value)) {
            res = [];
            for (let v of value) {
                if (v instanceof Mongo.ObjectID) {
                    v = v._str;
                }
                res.push({ value: v, label: options[v] });
            }
        } else res = { value: value, label: options[value] };
        return res;
    };

    renderImagePlaceholder = (src, load) => {
        if (!src) return <i className="material-icons">add_circle_outline</i>;
        if (!load) return <Spinner />;
        return null; // Only image
    };

    selectFuse = null;

    // Filter the options powered by Fuse.js then auto select the first element
    onSelectInputChange = val => {
        let res = this.selectFuse.search(val);
        if (val) {
            this.setState({ fusedOptions: res }, () => {
                this.inputRef.current.select.focusOption();
            });
        } else {
            this.setState({ fusedOptions: this.state.rawOptions }, () => {
                this.inputRef.current.select.focusOption();
            });
        }
    };

    render() {
        if (!this.props.name) throw new Error("Props: name is not set for this FieldItem");
        if (!this.props.context) throw new Error("Props: context is not set for this Field Item.");
        if (!this.props.schema) throw new Error(`No shcema is provided for this Field Item: ${this.props.name}`);

        this.schema = this.props.schema;
        this.parentState = this.props.context.state;
        this.name = this.props.name;
        this.field = this.schema[this.name];

        let { schema, name, field } = this;
        let state = this.parentState;

        if (!schema) throw new Error(`This FieldItem ${name} has no schema set. Check the parent class and set the schema.`);
        if (!state) throw new Error(`State of this FieldItem "${name}" is not set.`);
        if (!field) throw new Error(`Cannot find field in schema of parent of this FieldItem "${name}". Maybe a typo in name or schema, or not set.`);

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
                            <input
                                ref={this.inputRef}
                                id={name}
                                type="checkbox"
                                style={{ display: "none" }}
                                checked={state[name]}
                                disabled={disabled}
                                onChange={this.onChange}
                                onKeyDown={this.onKeyDown}
                            />
                            <div className={classList.join(" ")} />
                            <div className="aqui-input-title aqui-checkbox-label">{field.title}</div>
                        </div>
                        {field.caption && <span className="aqui-input-caption">{field.caption}</span>}
                    </div>
                );
            }
            case "select": {
                const value = this.processSelectValue(name, state, this.props.options || field.options) || null;
                const options = this.state.fusedOptions;
                return (
                    <div id={`${name}-input-item`} className="aqui-input-item vss" style={{ width: this.props.width || "100%" }}>
                        {field.title && <div className="hsc aqui-input-title">{field.title}</div>}
                        <Select
                            ref={this.inputRef}
                            className="h-full"
                            classNamePrefix="aqui-rs"
                            value={value}
                            onChange={val => this.onSelectChange(name, val)}
                            options={options}
                            isDisabled={disabled}
                            isMulti={this.props.multi || field.multi}
                            maxMenuHeight={480}
                            placeholder={field.placeholder}
                            onInputChange={this.onSelectInputChange}
                            filterOption={() => {
                                return true;
                            }}
                            onKeyDown={this.onKeyDown}
                            menuPortalTarget={document.getElementById("aq-components") || document.body}
                        />
                        {this.props.caption && <span className="aqui-input-caption">{this.props.caption}</span>}
                    </div>
                );
            }
            case "button": {
                let classList = ["aqui-btn"];
                if (this.props.transparent) classList.push("transparent");
                return (
                    <button
                        ref={this.inputRef}
                        className={classList.join(" ")}
                        onClick={this.props.onClick || this.field.onClick}
                        onKeyDown={this.onKeyDown}
                        disabled={disabled}
                        style={this.props.style}
                    >
                        {field.title}
                    </button>
                );
            }
            case "image": {
                let classList = ["input", "aqui-img-container"];
                if (!state[name]) classList.push("empty");

                return (
                    <div id={`${name}-input-item`} className="aqui-input-item vss" style={{ width: field.width || this.props.width || "100%" }}>
                        {(this.props.title || field.title) && <div className="hsc aqui-input-title">{this.props.title || field.title}</div>}
                        <div className={classList.join(" ")}>
                            <DropFile
                                handleDrop={field.handleDrop}
                                clickToSelect
                                disabled={disabled}
                                handleDrop={this.props.handleDrop || field.handleDrop}
                                style={{ width: "100%", minHeight: 34, color: "grey", boxSizing: "border-box", ...field.style, ...this.props.style }}
                            >
                                <img
                                    src={state[name] && field.srcTranslator ? field.srcTranslator(state[name]) : state[name]}
                                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                                    onLoad={e => this.setState({ imageLoad: true })}
                                />
                                {this.renderImagePlaceholder(state[name], this.state.imageLoad)}
                            </DropFile>
                        </div>
                        {field.caption && <span className="aqui-input-caption">{field.caption}</span>}
                    </div>
                );
            }
            case "textarea": {
                if (state[name] === undefined) console.warn(`Cannot find name in state of parent of this FieldItem "${name}". Check the parent class's state.`);
                return (
                    <div id={`${name}-input-item`} className="aqui-input-item vss" style={{ width: this.props.width || "100%" }}>
                        {(this.props.title || field.title) && <div className="hsc aqui-input-title">{this.props.title || field.title}</div>}
                        <textarea
                            ref={this.inputRef}
                            id={name}
                            name={name}
                            className="input"
                            value={state[name]}
                            onChange={this.onChange}
                            onKeyDown={this.onKeyDown}
                            disabled={disabled}
                            placeholder={this.props.placeholder || field.placeholder}
                            onInput={e => this.textAreaAutoResize(e.target)}
                        />
                        {field.caption && <span className="aqui-input-caption">{field.caption}</span>}
                    </div>
                );
            }
            default: {
                if (state[name] === undefined) console.warn(`Cannot find name in state of parent of this FieldItem "${name}". Check the parent class's state.`);
                return (
                    <div id={`${name}-input-item`} className="aqui-input-item vss" style={{ width: this.props.width || "100%" }}>
                        {(this.props.title || field.title) && <div className="hsc aqui-input-title">{this.props.title || field.title}</div>}
                        <input
                            ref={this.inputRef}
                            id={name}
                            name={name}
                            value={state[name]}
                            type={field.type || "text"}
                            onChange={this.onChange}
                            onKeyDown={this.onKeyDown}
                            disabled={disabled}
                            placeholder={this.props.placeholder || field.placeholder}
                        />
                        {field.caption && <span className="aqui-input-caption">{field.caption}</span>}
                    </div>
                );
            }
        }
    }

    onKeyDown = e => {
        // Esc
        if (e.keyCode === 27) {
            e.target.blur();
        }
        // Enter
        if (e.keyCode === 13 && e.target.tagName === "INPUT") {
            // Exclude Select
            if (this.inputRef.current && this.inputRef.current.select) return;
            for (let field in this.schema) {
                // Only button with callByEnter and itself is not disabled can dispatch the onClick
                if (this.schema[field].type === "button" && this.schema[field].callByEnter && !this.calculateDisable(field)) this.schema[field].onClick();
            }
        }
    };

    componentDidMount() {
        if (this.inputRef && this.inputRef.current && this.inputRef.current.tagName === "TEXTAREA") {
            this.textAreaAutoResize(this.inputRef.current);
        }
        if (this.field && this.field.options) {
            let translatedOptions = processSelectOptions(this.field.options);
            this.translateSelectAndSetFuse(translatedOptions);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.inputRef && this.inputRef.current && this.inputRef.current.tagName === "TEXTAREA") {
            this.textAreaAutoResize(this.inputRef.current);
        }
        let translatedOptions = processSelectOptions(this.field.options);
        if (!_.isEqual(this.state.rawOptions, translatedOptions)) {
            this.translateSelectAndSetFuse(translatedOptions);
        }
    }

    translateSelectAndSetFuse(translatedOptions) {
        this.setState({ rawOptions: translatedOptions, fusedOptions: translatedOptions });
        this.selectFuse = new Fuse(translatedOptions, {
            shouldSort: true,
            threshold: 0.8,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ["value", "tokenized", "initial"]
        });
    }

    textAreaAutoResize(textarea) {
        if (textarea.scrollHeight < 500) textarea.style.height = textarea.scrollHeight + "px";
    }
}

import pinyin from "pinyin";

// Translate object notated options to react-select options
// { value-1: label-1, value-2: label-2, ...} => [ { value: value-1, label: label-1 }, { value: value-2, label: label-2 }, ...]
export function processSelectOptions(options) {
    if (!options) return [];
    if (!_.isObject(options)) {
        console.error(options);
        throw new Error("Currently not accept original Select options format, use object instead { value: label }");
    }
    if (Object.keys(options).length === 0) return [];
    let res = [];
    const keys = Object.keys(options);
    for (let key of keys) {
        res.push({
            value: key,
            label: options[key],
            tokenized: pinyin(options[key], { style: pinyin.STYLE_NORMAL }).join(""),
            initial: pinyin(options[key], { style: pinyin.STYLE_FIRST_LETTER }).join("")
        });
    }
    return res;
}

export function PanelItem(props) {
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
            <div className="panel-item-value" style={{ ...props.valueStyle }}>
                {props.titleIcon || props.onClick ? <i className="material-icons">open_in_new</i> : ""}
                {props.value}
            </div>
        </div>
    );
}

export class InputGroup extends Component {
    render() {
        return <div className="aqui-input-group hbs h-full">{this.props.children}</div>;
    }
}

export function schemaDataPack(schema, state, fields = null) {
    let packedData = {};
    if (fields) {
        if (!(fields instanceof Array)) throw new Error("fields should be an array");
        for (let field of fields) {
            packedData[field] = state[field];
        }
    } else {
        for (let field in schema) {
            if (state[field] && !schema[field].noUpload) {
                packedData[field] = state[field];
            }
        }
    }
    return packedData;
}

export class TableHead extends Component {
    state = {
        dragging: false,
        startX: null,
        width: 80
    };
    th = React.createRef();

    render() {
        let classList = [];
        if (this.props.asc) classList.push("asc");
        if (this.props.dsc) classList.push("dsc");

        return (
            <th
                className={classList.join(" ")}
                ref={this.th}
                style={{ width: this.props.width || this.state.width }}
                onClick={e => {
                    e.stopPropagation();
                    this.props.onClick && this.props.onClick(e);
                }}
                onContextMenu={this.props.onContextMenu}
            >
                <div>
                    {this.props.content}
                    <div
                        className="th-resizer"
                        onMouseDown={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            this.setState({ dragging: true, startX: e.clientX, width: this.th.current.offsetWidth });
                            this.props.onDraggingStart && this.props.onDraggingStart(e);
                        }}
                        onClick={e => {
                            e.stopPropagation();
                        }}
                        onDoubleClick={this.onDoubleClick}
                    />
                </div>
            </th>
        );
    }

    onDoubleClick = e => {
        this.th.current.style.width = "1px";
    };

    mouseOverEventListener = e => {
        if (!this.state.dragging) return;
        let offsetX = this.state.width + e.clientX - this.state.startX;
        this.th.current.style.width = offsetX + "px";
    };

    mouseUpEventListener = e => {
        if (this.state.dragging) {
            this.setState({ dragging: false });
            this.props.onDraggingStop && this.props.onDraggingStop(e);
        }
    };

    componentDidMount() {
        document.addEventListener("mousemove", this.mouseOverEventListener);
        document.addEventListener("mouseup", this.mouseUpEventListener);
    }

    componentWillUnmount() {
        document.removeEventListener("mousemove", this.mouseOverEventListener);
        document.removeEventListener("mouseup", this.mouseUpEventListener);
    }
}

import Menu from "../Menus";
import { Mongo } from "meteor/mongo";

export class Table extends Component {
    state = {
        sortBy: this.props.sortBy,
        asc: this.props.asc,
        heads: [],
        headsHide: [],
        data: [],
        objectMode: false,
        headContextMenu: false,
        contextMenuX: 0,
        contextMenuY: 0,
        autoWidths: null,
        selected: [],
        filters: []
    };

    tableRef = React.createRef();
    theadRef = React.createRef();
    headRef = React.createRef();
    sortable = null;

    id = 0;

    renderHead = () => {
        if (!this.state.heads) return null;

        let renderedHeads = [];
        let { heads, headsHide, autoWidths } = this.state;
        for (let i in heads) {
            if (headsHide && headsHide.includes(heads[i])) continue;
            let field = this.state.objectMode ? heads[i] : i;

            renderedHeads.push(
                <TableHead
                    key={i}
                    width={autoWidths && autoWidths[field] && autoWidths[field] * 9 + 10}
                    content={this.props.headsTranslator ? this.props.headsTranslator.get(heads[i]) : heads[i]}
                    onClick={e => {
                        this.setState({ sortBy: field, asc: this.state.sortBy === field ? !this.state.asc : false });
                    }}
                    onContextMenu={e => this.onHeadContextMenu(e, field)}
                    asc={this.state.sortBy === field && this.state.asc}
                    dsc={this.state.sortBy === field && !this.state.asc}
                />
            );
        }
        renderedHeads.push(<th key="empty" className="ignore-elements" onContextMenu={e => this.onHeadContextMenu(e, "empty")} />);
        return renderedHeads;
    };

    sort() {
        let { sortBy, asc } = this.state;
        let resortedData = [...this.state.data];
        if (sortBy === null) return;
        resortedData.sort((d1, d2) => {
            let c1 = d1[sortBy];
            let c2 = d2[sortBy];
            if (_.isString(c1)) c1 = c1.trim().toLowerCase();
            if (_.isString(c2)) c2 = c2.trim().toLowerCase();

            if (!c1) return 1;
            else if (!c2) return -1;
            else if (c1 < c2) {
                return asc ? -1 : 1;
            } else if (c1 > c2) {
                return asc ? 1 : -1;
            } else return 0;
        });
        if (!_.isEqual(this.state.data, resortedData)) this.setState({ data: resortedData });
    }

    autoDetectWidth = () => {
        let width = {};
        let { heads, headsHide, data } = this.state;
        let { headsTranslator, dataTranslator } = this.props;

        for (let i in heads) {
            let field = this.state.objectMode ? heads[i] : i;
            if (headsHide && headsHide.includes(field)) continue;
            let maxLen = headsTranslator && headsTranslator.get(field) ? headsTranslator.get(field).length : field.length;
            for (let row of data) {
                let col = row[field];
                if (dataTranslator && dataTranslator[field]) {
                    col = dataTranslator[field](col);
                }
                if (!col) continue;
                maxLen = Math.max(maxLen, col.length);
            }
            width[field] = maxLen;
        }
        return width;
    };

    renderBody = () => {
        if (!this.state.data) return null;
        let renderedRows = [];
        let rowId = 0;

        this.state.data.forEach(row => {
            let renderedCol = [];
            let colId = 0;
            let { heads, headsHide } = this.state;
            let { dataTranslator } = this.props;
            for (let i in heads) {
                let field = this.state.objectMode ? heads[i] : i;
                if (headsHide && headsHide.includes(field)) continue;
                let col = row[field];
                if (dataTranslator && dataTranslator[field]) {
                    col = dataTranslator[field](col);
                }
                renderedCol.push(<td key={colId++}>{col}</td>);
            }
            renderedRows.push(
                <tr
                    className={this.state.selected.includes(row) ? "active" : ""}
                    key={rowId++}
                    onMouseDown={e => {
                        this.setState({ selected: [row] });
                        // TODO: Multi-select
                    }}
                    onBlur={e => {
                        this.setState({ select: [] });
                    }}
                    onClick={e => {
                        this.props.rowClick && this.props.rowClick(e, row);
                    }}
                    onDoubleClick={e => this.props.rowDoubleClick && this.props.rowDoubleClick(e, row)}
                    onContextMenu={e => this.props.rowContextMenu && this.props.rowContextMenu(e, row)}
                >
                    {renderedCol}
                    <td key={"empty"} />
                </tr>
            );
        });
        return renderedRows;
    };

    onHeadContextMenu = (e, field) => {
        e.preventDefault();
        this.setState({
            headContextMenu: field,
            contextMenuX: e.clientX,
            contextMenuY: e.clientY
        });
    };

    renderContextMenu() {
        let field = this.state.headContextMenu;
        if (!field) return;

        let contextMenu = [];

        // Add filter
        if (field !== "empty") {
            let fieldTitle = this.props.headsTranslator ? this.props.headsTranslator.get(field) : field;
            contextMenu.push(
                {
                    title: `Sort By ${fieldTitle}`,
                    isTitle: true
                },
                {
                    title: "Ascending",
                    onClick: e => {
                        this.setState({ sortBy: field, asc: true });
                    },
                    prefix: this.state.sortBy === field && this.state.asc ? "✓" : ""
                },
                {
                    title: "Descending",
                    onClick: e => {
                        this.setState({ sortBy: field, asc: false });
                    },
                    prefix: this.state.sortBy === field && !this.state.asc ? "✓" : ""
                },
                {
                    divider: true
                },
                {
                    title: "Filter",
                    isTitle: true
                },
                {
                    title: this.props.filterTitle || `Add Filter ${fieldTitle}`,
                    isTitle: true
                    // onClick: e => {
                    //     console.log("Add filter");
                    //     this.setState({
                    //         filters: [
                    //             ...this.state.filters,
                    //             {
                    //                 field,
                    //                 conditions: {
                    //                     $len: {
                    //                         $lg: 3
                    //                     },
                    //                     $includes: "Ali"
                    //                 }
                    //             }
                    //         ]
                    //     });
                    // }
                },
                {
                    divider: true
                }
            );
        }

        contextMenu.push({
            title: "Display",
            isTitle: true
        });

        let { heads, headsHide } = this.state;
        for (let head of heads) {
            let hided = headsHide.includes(head);
            contextMenu.push({
                title: this.props.headsTranslator ? this.props.headsTranslator.get(head) : head,
                prefix: hided ? "" : "✓",
                onClick: e => {
                    if (hided) headsHide.splice(headsHide.indexOf(head), 1);
                    else headsHide.push(head);
                    this.setState({ headsHide });
                }
            });
        }

        let renderedContextMenu = <Menu context={this} name="headContextMenu" x={this.state.contextMenuX} y={this.state.contextMenuY} content={contextMenu} />;
        return ReactDOM.createPortal(renderedContextMenu, document.body);
    }

    render() {
        return (
            <>
                <table id="table" ref={this.tableRef}>
                    {!this.props.noHead && this.props.heads && (
                        <thead ref={this.theadRef}>
                            <tr ref={this.headRef}>{this.renderHead()}</tr>
                        </thead>
                    )}
                    <tbody>{this.renderBody()}</tbody>
                </table>
                {this.renderContextMenu()}
            </>
        );
    }

    componentDidMount() {
        if (!this.props.data || !(this.props.data instanceof Array)) {
            throw new Error("Table data should be an Array, of arrays or objects");
        }
        this.setState({
            data: this.props.data,
            heads: this.props.heads,
            headsHide: this.props.headsHide,
            objectMode: !Array.isArray(this.props.data[0])
        });

        // TODO: Still bugging using Sortable
        // if (this.headRef.current) {
        //     this.sortable = Sortable.create(this.headRef.current, {
        //         direction: "horizontal",
        //         animation: 150,
        //         ghostClass: "ghost",
        //         filter: ".ignore-elements",
        //         onChange: e => {
        //             let oldIndex = e.oldIndex;
        //             let newIndex = e.newIndex;

        //             let newHeads = [...this.state.heads];
        //             let tmp = newHeads[oldIndex];
        //             newHeads[oldIndex] = newHeads[newIndex];
        //             newHeads[newIndex] = tmp;

        //             this.setState({ heads: newHeads });
        //         }
        //     });
        // }
    }

    componentDidUpdate(prevProps, prevState) {
        let tmpState = {};

        let widths = this.autoDetectWidth();
        if (!_.isEqual(widths, this.state.autoWidths)) {
            tmpState.autoWidths = widths;
        }

        this.sort();

        if (!_.isEqual(this.props.data, prevProps.data) || !_.isEqual(this.props.heads, prevProps.heads)) {
            tmpState.data = this.props.data;
            tmpState.heads = this.props.heads;
        }

        if (!_.isEmpty(tmpState)) this.setState(tmpState);
    }
}
