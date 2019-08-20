import React, { Component } from "react";
import PropTypes from "prop-types";
import Window, { WINDOW_PRIORITY_TOP } from "./Window";
import { R } from "../resources_feeder";
import Select, { components } from "react-select";
import pinyin from "pinyin";
import Fuse from "fuse.js";
import _ from "lodash";
import { Collection, oss } from "../utils";
import { connect } from "react-redux";

const defaultState = {
    cardinalInput: "",
    fusedOptions: [],
    menuIsOpen: false,
    windowHeight: 0,
    currentCommand: null
};

const defaultFuseOption = {
    shouldSort: true,
    threshold: 0.8,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    tokenize: true,
    keys: []
};

let rootOptions = {};

let commands = {
    _root: {
        data: Object.values(rootOptions),
        fuseOption: {
            keys: ["title", "subtitle"]
        },
        fields: item => ({
            title: item.title,
            subtitle: item.subtitle,
            icon: item.icon,
            onSelect: item.onSelect
        })
    },
    emp: {
        data: () =>
            Collection("employees")
                .find()
                .fetch(),
        fuseOption: {
            keys: ["nickname", "fname", "lname", "email", "mobile"]
        },
        fields: item => {
            const src = oss(item.avatar);
            return {
                icon: <img src={src} />,
                title: `${item.nickname} - ${item.fname}`,
                subtitle: `${item.mobile} - ${item.email}`,
                onSelect: () => {
                    console.log("Employee Click: ", item);
                },
                optionProps: {
                    style: { background: "gold" }
                }
            };
        }
    },
    cus: {
        data: () =>
            Collection("customers")
                .find()
                .fetch(),
        fuseOption: {
            keys: ["name", "abbr"]
        },
        fields: item => {
            const src = oss(item.logo);
            return {
                icon: <img src={src} />,
                title: item.name,
                subtitle: item.abbr,
                onSelect: () => {
                    console.log("Employee Click: ", item);
                }
            };
        }
    }
};

/**
 * Add command to Cardinal
 * @param {string} command - The command name can trigger the command, must be unique
 * @param {(function(string)=>Array|Array)} data - a function with query to get data or data array
 * @param {{keys: string[]}} fuseOption - options for using Fuse.js
 * @param {function(any)=>{title: string, subtitle: string, icon: Node, extra: Node, onSelect: function}} fields - Mapping of result and display of item in Cardinal
 * @param {{pinyinTokenized: boolean}} options - options when adding command.
 * @return {boolean} The boolean status of add result
 */
export function addCommand(command, data, fuseOption = { keys: [] }, fields, options = {}) {
    if (options.pinyinTokenized) {
        // This really time-consuming Θ(data.length * keys.length)
        for (let datum of data) {
            for (let key of fuseOption.keys) {
                let pinYinFirstLetters = pinyin(datum[key], { style: pinyin.STYLE_FIRST_LETTER }).join("");
                if (pinyin !== datum[key]) {
                    datum[`${key}_pyi`] = pinYinFirstLetters;
                    datum[`${key}_py`] = pinyin(datum[key], { style: pinyin.STYLE_NORMAL }).join("");
                }
            }
        }
        fuseOption.keys.map(key => {
            fuseOption.keys.push(`${key}_pyi`, `${key}_py`);
        });
    }

    commands[command] = {
        data,
        fuseOption,
        fields
    };
    return true;
}

/**
 *
 * @param {string} key - Unique key to represent this data
 * @param {{title: string, subtitle: string, icon: Node, extra: Node, onSelect: function}} data - same with the fields
 * @param {{pinyinTokenized: boolean}} options - options when adding command.
 */
export function addRootOptions(key, item, options = {}) {
    if (options.pinyinTokenized) {
        ["title", "subtitle"].map(k => {
            let pinYinFirstLetters = pinyin(item[k], { style: pinyin.STYLE_FIRST_LETTER }).join("");
            if (pinyin !== item[k]) {
                item[`${k}_pyi`] = pinYinFirstLetters;
                item[`${k}_py`] = pinyin(item[k], { style: pinyin.STYLE_NORMAL }).join("");
            }
        });
        if (!commands._root.fuseOption.keys.includes("title_py")) {
            commands._root.fuseOption.keys.push("title_py", "title_pyi", "subtitle_py", "subtitle_pyi");
        }
    }
    rootOptions[key] = item;

    commands._root.data = Object.values(rootOptions);
}

export function deleteRootOptions(key) {
    delete rootOptions[key];
}

class Cardinal extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,

        auth: PropTypes.object
    };

    inputRef = React.createRef();
    menuContainerRef = React.createRef();

    state = defaultState;

    onChange = val => {
        if (val.onSelect) val.onSelect();
        this.props.onClose();
    };

    onKeyDown = e => {
        // Esc
        if (e.keyCode === 27) {
            this.props.onClose();
        }
    };

    onSelectInputChange = val => {
        if (!val || val.length === 0) {
            this.setState({ menuIsOpen: false, cardinalInput: "" });
        } else {
            this.setState({ menuIsOpen: true, cardinalInput: val }, () => {
                this.inputUpdate();
            });
        }
    };

    fuse = null;

    inputUpdate = () => {
        let res = [];

        let input = this.state.cardinalInput;
        let parts = input.split(" ");
        const cmd = parts[0];
        const q = parts.slice(1).join(" ") || parts[0];

        let rule = commands[cmd] || commands._root;

        if (rule) {
            let data = _.isFunction(rule.data) ? rule.data(q) : rule.data;
            const fuseOption = { ...defaultFuseOption, ...rule.fuseOption };
            data = new Fuse(data, fuseOption).search(q);
            for (let item of data) {
                res.push(rule.fields(item));
            }
        }

        if (this.inputRef.current && !_.isEqual(res, this.state.fusedOptions)) {
            this.setState({ fusedOptions: res, currentCommand: cmd }, () => {
                this.inputRef.current.select.focusOption();
            });
        }
    };

    render() {
        if (!this.props.open) return null;

        return (
            <Window
                _key="cardinal"
                appKey="system"
                y={"10vh"}
                width={600}
                title={"Cardinal"}
                noTitlebar
                noControl
                escToClose
                onClose={this.props.onClose}
                style={{ border: 0, background: "none", height: this.state.windowHeight, overflow: "hidden" }}
                contentStyle={{ display: "flex", flexDirection: "column" }}
                windowPriority={WINDOW_PRIORITY_TOP}
                canResize={false}
                canMaximize={false}
                canMinimize={false}
                className="handle"
            >
                <Select
                    ref={this.inputRef}
                    components={{ Option: item => <CardinalItem item={item} /> }}
                    className="h-full"
                    classNamePrefix="cardinal"
                    value={this.state.selectedOption}
                    onChange={this.onChange}
                    options={this.state.fusedOptions}
                    maxMenuHeight={480}
                    placeholder={R.get("CARDINAL_PH")}
                    onInputChange={this.onSelectInputChange}
                    filterOption={() => {
                        return true;
                    }}
                    onKeyDown={this.onKeyDown}
                    menuIsOpen={this.state.menuIsOpen}
                    // onBlur={this.props.onClose}
                />
                <div ref={this.menuContainerRef} style={{ width: "100%", height: "auto" }} />
            </Window>
        );
    }

    componentDidUpdate() {
        // Always focus
        if (this.inputRef.current) {
            this.inputRef.current.focus();
        }
        const ctrlHeight = _.get(this, "inputRef.current.select.controlRef.clientHeight", 0);
        const menuHeight = _.get(this, "inputRef.current.select.menuListRef.clientHeight", 0);
        if (this.state.windowHeight !== ctrlHeight + menuHeight) this.setState({ windowHeight: ctrlHeight + menuHeight });

        // Clean when quit
        if (!this.props.open && !_.isEqual(this.state, defaultState)) {
            this.setState(defaultState);
        }
    }
}

const mapStateToProps = state => ({ auth: state.auth, db: state.db });

export default connect(
    mapStateToProps,
    null
)(Cardinal);

// (data, fuseOption, { icon, title, subtitle }, clickCallback) => { ... }

class CardinalItem extends React.Component {
    static propTypes = {
        item: PropTypes.object.isRequired
    };

    render() {
        const item = this.props.item;
        const { icon, title, subtitle, extra } = item.data;
        return (
            <components.Option {...item}>
                <div className="cardinal-item hsc h-full" {...item.data.optionProps}>
                    {this.renderIcon(icon)}
                    {this.renderTitle(title, subtitle)}
                    {this.renderExtra(extra)}
                </div>
            </components.Option>
        );
    }

    renderIcon = icon => {
        if (!icon) return null;
        return <div className="cardinal-item-icon">{icon}</div>;
    };

    renderTitle = (title, subtitle) => {
        return (
            <div className="cardinal-item-title-container vbs">
                <span className="cardinal-item-title">{title}</span>
                <span className="cardinal-item-subtitle">{subtitle}</span>
            </div>
        );
    };

    renderExtra = extra => {
        return <div className="cardinal-item-extra">{extra}</div>;
    };
}
