/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { isEmpty } from 'lodash';
import toast from 'react-hot-toast';
import FormRegister from '../../../container/components/user/register/FormRegister';
import { node_info, permission_api, user_api } from '../../../container/services/api/fetch';
import { first_array } from '../../../container/helpers';
import { R_PROFILE, R_TOKEN, R_FORM_LOGIN, R_NODE_ID, R_PERMISSION, R_NODE_INFO } from '../../../container/reducers/actions';
import AuthService from '../../../container/core/auth/AuthService';

const auth = new AuthService();

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // step: 1,
            // loading: false,
        };
    }

    componentDidMount() {
        // const { register, history, dispatch, affiliate_code, location } = this.props;
        // const get_string = location.search.split('?').pop();
        // const get_key_affiliate = location.search.split('=').pop();
        // if (get_string.includes('affiliate')) {
        //     if (isEmpty(affiliate_code)) {
        //         dispatch({ type: R_AFFILLIATE_CODE, payload: get_key_affiliate });
        //     }
        // }
        // if (register.access_token !== '') {
        //     const params = {
        //         mtype: 'validateSocialId',
        //         social_id: register.social_id,
        //         provider: 'google',
        //     };
        //     user_api(params).then(({ status }) => {
        //         if (status === false) {
        //             this.register(false);
        //         } else {
        //             history.push('/register');
        //         }
        //     });
        // }
    }

    register = (params, cb) => {
        const { history } = this.props;
        const params_tmp = {
            full_name: params.full_name.value,
            email: params.email.value,
            phone: params.phone.value,
            password: params.password.value,
            cf_password: params.cf_password.value,
            // avatar: register.avatar,
            // social: register.social,
            // social_id: register.social_id,
        };
        const params_register = { ...params_tmp, mtype: 'register' };

        user_api(params_register).then((data) => {
            console.log(data);
            // if (data.errors !== undefined) {
            //     notification('error', 'Lỗi', first_array(data.errors.message));
            // } else {
            //     notification('success', 'Thành công', 'Chúng tôi đã gửi 1 email tới cho bạn.<br/>Email sẽ chứa thông tin để đăng nhập dịch vụ.</br> Vui lòng kiểm tra email.', 10000);
            //     const data_r = data.data;
            //     history.push(`/login-via-token/${data_r.node_name}/${data_r.token}`);
            // }
            if (cb) cb();
        });
    }

    onLogin = (params, cb) => {
        const { dispatch, history } = this.props;
        const params_login = { ...params, mtype: 'login' };
        auth.login(params_login).then((data) => {
            if (data.errors !== undefined) {
                toast.error('Đã có lỗi xảy ra!', {
                });
                if (cb) cb();
            } else {
                dispatch({ type: R_NODE_ID, payload: data.node_id });
                auth.setToken(data.token, () => {
                    auth.getInfo({
                        mtype: 'profile_info',
                    }).then((user_info) => {
                        dispatch({ type: R_PROFILE, payload: user_info });
                        dispatch({ type: R_TOKEN, payload: data.token });
                        dispatch({
                            type: R_FORM_LOGIN,
                            payload: {
                                node_name: params_login.node_name,
                                username: params_login.username,
                            },
                        });
                        permission_api({
                            mtype: 'getAllPermissionByUser',
                            user_id: user_info.personnel_id,
                        }).then(({ permission }) => {
                            dispatch({ type: R_PERMISSION, payload: permission });
                        });
                        node_info({
                            mtype: 'node_data',
                        }).then(({ node_data }) => {
                            if (cb) cb();
                            dispatch({ type: R_NODE_INFO, payload: node_data });
                            parseInt(node_data.welcome) === 0
                                ? history.push('/setting/welcome')
                                : history.push('/dashboard');
                        });
                    });
                });
            }
        });
    }

    render() {
        // const { register } = this.state;
        // const { register, history } = this.props;
        return (
            <>
                <FormRegister {...this.props} register={this.register} />
            </>
        );
    }
}
const mapStateToProps = ({ persist }) => ({
    affiliate_code: persist.affiliate_code,
});
export default withRouter(connect(mapStateToProps)(Register));
