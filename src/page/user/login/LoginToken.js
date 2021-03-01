import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { waterfall } from 'async';
import toast from 'react-hot-toast';
import { node_info, permission_api, user_api, role_api } from '../../../container/services/api/fetch';
import AuthService from '../../../container/core/auth/AuthService';
import { R_FORM_LOGIN } from '../../../container/reducers/actions';
import { tclass } from '../../../container/components/common/library';
import { CHANGE_NODE_ID, CHANGE_TOKEN, CHANGE_PROFILE, CHANGE_ROLE, CHANGE_PERMISSION, CHANGE_NODE_INFO } from '../../../container/reducers/thunk';

const auth = new AuthService();

class LoginToken extends Component {
    componentDidMount() {
        const { match } = this.props;
        const { params } = match;
        const { dispatch, history } = this.props;
        waterfall([
            (callback) => {
                user_api({ token_login: params.token, node_name: params.node_name, mtype: 'login_token' }).then((data) => {
                    dispatch({
                        type: R_FORM_LOGIN,
                        payload: {
                            node_name: params.node_name,
                            username: data.username,
                        },
                    });
                    if (data.errors !== undefined) {
                        toast.error('Đã có lỗi xảy ra!', {
                        });
                    } else {
                        const { node_id } = data;
                        dispatch(CHANGE_NODE_ID(parseInt(node_id, 10))).then(() => {
                            callback(null, data);
                        });
                    }
                });
            },
            (data, callback) => {
                const { token } = data;
                auth.setToken(token, () => {
                    dispatch(CHANGE_TOKEN(token)).then(() => {
                        callback(null, data);
                    });
                });
            },
            (data, callback) => {
                const { token } = data;
                auth.getInfo({
                    mtype: 'profile_info',
                    token,
                }).then((user_info) => {
                    dispatch(CHANGE_PROFILE(user_info)).then(() => {
                        callback(null, data, user_info);
                    });
                });
            },
            (data, user_info, callback) => {
                const { personnel_id } = user_info;
                role_api({
                    mtype: 'getAllRoleByUser',
                    user_id: personnel_id,
                }).then(({ role }) => {
                    dispatch(CHANGE_ROLE(role !== undefined ? role : [])).then(() => {
                        callback(null, data, user_info, role);
                    });
                });
            },
            (data, user_info, role, callback) => {
                const { personnel_id } = user_info;
                permission_api({
                    mtype: 'getAllPermissionByUser',
                    user_id: personnel_id,
                }).then(({ permission }) => {
                    dispatch(CHANGE_PERMISSION(permission !== undefined ? permission : [])).then(() => {
                        callback(null, data, user_info, role, permission);
                    });
                });
            },
            (data, user_info, role, permission, callback) => {
                node_info({
                    mtype: 'node_data',
                }).then(({ node_data }) => {
                    dispatch(CHANGE_NODE_INFO(node_data !== undefined ? node_data : {})).then(() => {
                        callback(null, node_data);
                    });
                });
            },
        ], (err, result) => {
            parseInt(result.welcome) === 1
                ? history.push('/setting/welcome')
                : history.push('/dashboard');
        });
    }

    render() {
        return (
            <>
                <div className="container_login_bg container_bg container_login_check_box">
                    <div className="container_login container_login_check">
                        <div className={tclass('avatar_check')}>
                            <img src="/image/verification.svg" alt="BNC Project" className="img-responsive img_scale_down" />
                        </div>
                        <div className="cssload-loader">
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                        <span>Hệ thống đang xác định đăng nhập...</span>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = () => ({});
export default withRouter(connect(mapStateToProps)(LoginToken));
