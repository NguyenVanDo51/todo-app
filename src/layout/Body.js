import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import AuthService from '../container/core/auth/AuthService';
import { R_PROFILE } from '../container/reducers/actions';
import NavTop from '../container/components/layout/NavTop';
import TodoCatogory from '../page/todos/TodoCategory';
import LoadingFullscreen from '../page/loading';

const auth = new AuthService();

const Body = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [is_login, setIsLogin] = useState(false);
    const { loading_fullscreen } = props;

    useEffect(() => {
        auth.getInfo().then((res) => {
            if (res) {
                dispatch({ type: R_PROFILE, payload: { name: res.name, email: res.email } });
                setIsLogin(true);
            } else {
                history.push('/login');
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {

    // })
    // if (loading_fullscreen) return

    return (
        <>
            {loading_fullscreen && <LoadingFullscreen loading_fullscreen={loading_fullscreen} />}
            <div className="app">
                <div className="_app_box">
                    <div className="main">
                        {is_login && (
                            <>
                                <NavTop />
                                <div className="app_content">
                                    <TodoCatogory {...props} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = ({ persist, state }) => ({
    profile: persist.profile,
    loading_fullscreen: state.loading_fullscreen,
    categories_todo: state.categories_todo,
});

export default connect(mapStateToProps)(Body);
