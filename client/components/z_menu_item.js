import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as UI from '@material-ui/core';
import _ from "lodash";

class ZMenuItem extends Component {
    style = {
        '&:focus': {
            backgroundColor: "blue",
            '& $primary, & $icon': {
                color: "white",
            },
        },
    }

    render() {
        if(!this.props.menu || !this.props.id || !this.props.context) {
            console.error("ZMenuItem needs menu, id, context(this).");
            return null;
        }
        
        // Get the parent's context's specific menu's id
        var activeItemIdInThisMenu = _.get(this.props.context.state,this.props.menu, null);
        return (
            <UI.MenuItem className={"zMenuItem "+(this.props.id===activeItemIdInThisMenu?"zMenuItem-active":"")} onClick={()=>{this.props.context.setState({[this.props.menu]: this.props.id})}}>
                {this.props.icon ? <UI.ListItemIcon><UI.Icon>{this.props.icon}</UI.Icon></UI.ListItemIcon> : ""}
                <UI.ListItemText inset={this.props.inset} primary={this.props.title} secondary={this.props.subtitle} />
                {this.props.children ? <UI.ListItemSecondaryAction>{this.props.children}</UI.ListItemSecondaryAction> : ""}
            </UI.MenuItem>
        );
    }

    componentWillMount() {
        if(this.props.default) this.props.context.setState({[this.props.menu]: this.props.id});
    }
}

function mapStateToProps(state) {
    return {
        /* Reducers */
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ /* Actions */ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ZMenuItem);