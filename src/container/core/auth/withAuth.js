import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AuthService from '../auth/AuthService';
import { CHANGE_TOTAL_UNREAD, R_PROFILE } from '../../reducers/actions/index';
import { room_user_api } from '../../api';

const auth = new AuthService();

const withAuth = (AuthComponent) => {
    //Check xem có đang đăng nhập không?
    const nxt = class Authenticated extends React.Component {
        constructor(props) {
            super(props);
            this.interval = null;
            this.listen_uid = 0;
        }

        componentDidMount() {
            const { dispatch, history } = this.props;
            auth.getInfo().then((res) => {
                if (res) {
                    dispatch({ type: R_PROFILE, payload: { name: res.name, email: res.email } });
                } else {
                    history.push('/login');
                }
            });
        }

        render() {
            return (
                <div>
                    <AuthComponent {...this.props} />
                </div>
            );
        }
    };
    const mapStateToProps = ({ state, persist }) => ({
        login: state.login,
        list_chat: state.list_chat,
        profile: persist.profile,
    });
    return withRouter(connect(mapStateToProps)(nxt));
};

export default withAuth;
