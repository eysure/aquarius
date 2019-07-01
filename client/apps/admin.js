import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Action from "../actions";
import uuidv4 from "uuid/v4";

import Window from "../components/Window";

class Admin extends React.Component {
    state = {
        window: 0
    };

    window = context => {
        let res = [];
        for (let i = 0; i < this.state.window; i++) {
            let key = `sub${i + 1}`;
            res.push(
                <Window key={key} _key={key} width={400} height={300} appKey={this.props.appKey} theme="dark" titlebar={key}>
                    <div className="handle" style={{ width: "100%", height: "100%" }}>
                        {context.props.user.fn_en}
                    </div>
                </Window>
            );
        }
        return res;
    };

    render() {
        return (
            <>
                <Window key="Main" _key="Main" width={400} height={300} appKey={this.props.appKey} theme="dark" titlebar="Main">
                    <div className="handle" style={{ width: "100%", height: "100%" }}>
                        {this.props.user.fn_en}
                        <button onClick={() => this.setState({ window: this.state.window + 1 })}>add</button>
                    </div>
                </Window>
                {this.window(this)}
            </>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => bindActionCreators(Action, dispatch);

Admin.manifest = {
    appKey: "admin",
    appName: ["Admin", "管理员"],
    icon: "/assets/apps/chauffeur.svg"
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Admin);
