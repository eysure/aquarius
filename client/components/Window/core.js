/*
 * Aquarius UI Core
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import _ from "lodash";

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

export class FieldItem extends Component {
    schema = null;
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
        } else if (key === "$!eq") {
            if (this.state[val] === undefined) {
                throw new Error(
                    `Exception when calculate single condition. When compare state.${name} and state.${val}, state.${val} is not exist in the state, maybe a typo, or not set.`
                );
            }
            return this.state[name] !== this.state[val];
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
        if (this.schema[name].valid === undefined) return true;
        return this.calculateConditions(name, this.schema[name].valid);
    };

    calculateDisable = name => {
        if (this.state.processing) return true;
        if (this.schema[name].disabled === true) return true;
        if (!this.schema[name].disabled) return false;
        return this.calculateConditions(name, this.schema[name].disabled);
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
        if (!this.props.schema) throw new Error(`No shcema is provided for this Field Item: ${this.props.name}`);

        this.schema = this.props.schema;
        this.state = this.props.context.state;
        this.name = this.props.name;
        this.field = this.schema[this.name];

        let { schema, state, name, field } = this;

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
        if (!fields instanceof Array) throw new Error("fields should be an array");
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

export class Table extends Component {
    state = {
        sortBy: null,
        asc: false,
        heads: [],
        headsHide: [],
        data: [],
        objectMode: false,
        headContextMenu: false,
        contextMenuX: 0,
        contextMenuY: 0,
        autoWidths: null,
        selected: []
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
                    content={this.props.headsTranslator ? this.props.headsTranslator.Str(heads[i]) : heads[i]}
                    onClick={e => {
                        this.setState({ sortBy: field, asc: this.state.sortBy === field ? !this.state.asc : false });
                    }}
                    asc={this.state.sortBy === field && this.state.asc}
                    dsc={this.state.sortBy === field && !this.state.asc}
                />
            );
        }
        renderedHeads.push(<th key="empty" className="ignore-elements" />);
        return renderedHeads;
    };

    sort() {
        let { sortBy, asc } = this.state;
        let resortedData = [...this.state.data];
        if (sortBy === null) return;
        resortedData.sort((d1, d2) => {
            if (d1[sortBy] < d2[sortBy]) {
                return asc ? -1 : 1;
            } else if (d1[sortBy] > d2[sortBy]) {
                return asc ? 1 : -1;
            } else return 0;
        });
        this.setState({ data: resortedData });
    }

    autoDetectWidth = () => {
        let width = {};
        let { heads, headsHide, data } = this.state;
        let { dataTranslator } = this.props;

        for (let i in heads) {
            let field = this.state.objectMode ? heads[i] : i;
            if (headsHide && headsHide.includes(field)) continue;
            let maxLen = 0;
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

    onHeadContextMenu = e => {
        e.preventDefault();
        this.setState({
            headContextMenu: true,
            contextMenuX: e.clientX,
            contextMenuY: e.clientY
        });
    };

    renderContextMenu() {
        let contextMenu = [];
        let { heads, headsHide } = this.state;
        for (let head of heads) {
            let hided = headsHide.includes(head);
            contextMenu.push({
                title: this.props.headsTranslator ? this.props.headsTranslator.Str(head) : head,
                prefix: hided ? "" : "✓",
                onClick: e => {
                    if (hided) headsHide.splice(headsHide.indexOf(head), 1);
                    else headsHide.push(head);
                    this.setState({ headsHide });
                }
            });
        }

        let renderedContextMenu = <Menu context={this} name="headContextMenu" x={this.state.contextMenuX} y={this.state.contextMenuY} content={contextMenu} />;
        let menuContainer = document.getElementById("menu-container");
        return ReactDOM.createPortal(renderedContextMenu, menuContainer);
    }

    render() {
        return (
            <>
                <table id="table" ref={this.tableRef}>
                    {!this.props.noHead && this.props.heads && (
                        <thead ref={this.theadRef}>
                            <tr ref={this.headRef} onContextMenu={this.onHeadContextMenu}>
                                {this.renderHead()}
                            </tr>
                        </thead>
                    )}
                    <tbody>{this.renderBody()}</tbody>
                </table>
                {this.renderContextMenu()}
            </>
        );
    }

    componentDidMount() {
        if (!this.props.data || !this.props.data instanceof Array) {
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
        let widths = this.autoDetectWidth();
        if (!_.isEqual(widths, this.state.autoWidths)) {
            this.setState({ autoWidths: widths });
        }

        if (!_.isEqual(this.state.sortBy, prevState.sortBy) || !_.isEqual(this.state.asc, prevState.asc)) {
            this.sort();
        }
    }
}
