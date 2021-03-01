/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FormSetting from '../../../container/components/user/setting/FormSetting';

class Setting extends Component {
    render() {
        return (
            <>
                <FormSetting />
            </>
        );
    }
}
const mapStateToProps = (state, persist) => ({
        register: state.register,
        affiliate_code: persist.affiliate_code,
    });
export default withRouter(connect(mapStateToProps)(Setting));
