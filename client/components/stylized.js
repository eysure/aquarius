import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";

export class Stylized extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        user: PropTypes.object
    };

    render() {
        let classList = [];
        let theme = _.get(this.props.user, "preferences.theme");
        if (!theme) {
            const lastLoginUser = localStorage.getItem("lastLoginUser");
            if (lastLoginUser) theme = JSON.parse(lastLoginUser).theme;
        }
        classList.push(theme || "light");

        return (
            <div id="aq-components" className={classList.join(" ")}>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Stylized);
