import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FormLogin from '../../../container/components/user/login/FormLogin';
import AuthService from '../../../container/core/auth/AuthService';

const auth = new AuthService();

class Login extends Component {
    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        const {history} = this.props;
        auth.getInfo().then((res) => {
            if (res) history.push('/app')
        })
    }

    render() {
        return (
            <FormLogin {...this.props} />
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    form_login: persist.form_login,
});

export default withRouter(connect(mapStateToProps)(Login));
