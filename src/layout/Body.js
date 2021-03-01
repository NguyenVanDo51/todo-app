import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { user_logout_api } from '../container/api';
import AuthService from '../container/core/auth/AuthService';
import { R_PROFILE } from '../container/reducers/actions';
import localforage from 'localforage';
import { waterfall } from 'async';
import NavTop from '../container/components/layout/NavTop';
import TodoCatogory from '../page/todos/TodoCategory';

const auth = new AuthService();

const Body = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        auth.getInfo().then((res) => {
            if (res) {
                dispatch({ type: R_PROFILE, payload: { name: res.name, email: res.email } });
            } else {
                history.push('/login');
            }
        });
    }, []);

    return (
        <>
            <div className="app">
                <div className="_app_box">
                    <div className="main">
                        <NavTop />
                        <div className="app_content">
                            <TodoCatogory {...props} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = ({ persist, state }) => ({
    profile: persist.profile,
});

export default connect(mapStateToProps)(Body);
