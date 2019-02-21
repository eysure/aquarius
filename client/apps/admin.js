import React from "react";
import App from "../components/app_shell";
import * as UI from "@material-ui/core";

import Window from "../components/dialog";

class Admin extends React.Component {
    static appStaticProps = {
        appName: ["Admin", "管理员"],
        materialIcon: true,
        icon: "trip_origin"
    };

    render() {
        return (
            <Window
                appProps={this.props.appProps}
                width={840}
                height={720}
                aria-labelledby="admin"
            >
                <UI.DialogTitle>Trumode.app Admin Page</UI.DialogTitle>
            </Window>
        );
    }

    componentDidMount() {
        throw Error("Just an error");
    }
}

export default Admin;
