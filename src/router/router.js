import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Body from '../layout/Body';
import Login from '../page/user/login/login';
import Intro from '../page/intro/Introduction';

class TRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return (
            <BrowserRouter>
                <>
                    <Route exact path="/" component={Intro} />
                    <Route exact path="/login" component={Login} />
                    {/* <Route exact path="/app" component={Body} /> */}
                    <Route exact path="/app/:id?" component={Body} />
                </>
            </BrowserRouter>
        );
    }
}
const mapStateToProps = ({ state, persist }) => ({
    login: state.login,
    userRole: persist.userRole,
    userPermission: persist.userPermission,
    profile: persist.profile,
});
export default connect(mapStateToProps)(TRouter);
