import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Action from "../actions";
import uuidv4 from "uuid/v4";

import Window, { WINDOW_PRIORITY_HIGH } from "../components/Window";

class Admin extends React.Component {
    state = {
        window: 1
    };

    windows = context => {
        let res = [];
        for (let i = 0; i < this.state.window; i++) {
            let key = `sub${i + 1}`;
            res.push(
                <Window
                    key={key}
                    _key={key}
                    width={400}
                    height={300}
                    appKey={context.props.appKey}
                    theme="dark"
                    windowPriority={WINDOW_PRIORITY_HIGH}
                    toolbar="Toolbar"
                >
                    <div className="handle" style={{ width: "100%", height: "100%" }}>
                        {context.props.user.fn_en}
                        <button onClick={() => context.setState({ window: context.state.window + 1 })} />
                    </div>
                </Window>
            );
        }
        return res;
    };

    render() {
        return this.windows(this);
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
