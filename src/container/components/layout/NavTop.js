import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { waterfall } from 'async';
import AuthService from '../../core/auth/AuthService';
import { CHANGE_SHOW_NAV_LEFT } from '../../reducers/actions';
import { useOnClickOutside } from '../../helpers/useOnClickOutside';

const auth = new AuthService();

const NavTop = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [is_show_user_option, setShowUserOption] = useState(false);
    const [is_show_notify_box, setShowNotifyBox] = useState(false);
    const ref_user_option = useRef();
    const ref_show_notify = useRef();

    useOnClickOutside(ref_user_option, () => {
        setShowUserOption(false);
    });
    useOnClickOutside(ref_show_notify, () => {
        setShowNotifyBox(false);
    });
    const { is_show_nav_left } = useSelector(({ state }) => ({
        is_show_nav_left: state.is_show_nav_left,
    }));

    const handleToggleNavLeft = () => {
        dispatch({ type: CHANGE_SHOW_NAV_LEFT, payload: !is_show_nav_left });
    };

    return (
        <div className="nav_container">
            <div className="left">
                <button
                    type="button"
                    aria-label="Main menu"
                    role="switch"
                    aria-checked="true"
                    className="left_menu_toggle top_bar_btn"
                    data-reach-tooltip-trigger=""
                    onClick={handleToggleNavLeft}
                >
                    <svg className="menu_icon" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M4.5 5h15a.5.5 0 1 1 0 1h-15a.5.5 0 0 1 0-1zm0 6h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 6h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1z"
                        ></path>
                    </svg>
                </button>
                {/* <button type="button" aria-label="Go to start page" onClick={() => { location.replace('/app/task'); }} className="top_bar_btn" data-reach-tooltip-trigger="">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12.527 3.075c.35.104.64.263 1.27.876L19.1 9.123c.374.364.49.505.601.678.11.174.185.351.232.552.042.178.062.34.066.742L20 17.718c0 .446-.046.607-.134.77a.906.906 0 01-.378.378c-.163.088-.324.134-.77.134H14v-4.718c0-.446-.046-.607-.134-.77a.906.906 0 00-.378-.378c-.142-.077-.284-.122-.616-.132L12.718 13h-1.436c-.446 0-.607.046-.77.134a.906.906 0 00-.378.378c-.077.142-.122.284-.132.616l-.002.154V19H5.282c-.446 0-.607-.046-.77-.134a.906.906 0 01-.378-.378c-.088-.163-.134-.324-.134-.77v-6.462c0-.522.02-.703.067-.903.047-.2.121-.378.232-.552l.077-.113c.098-.134.233-.282.524-.565l5.304-5.172c.629-.613.92-.772 1.269-.876a1.82 1.82 0 011.054 0zm-.286.958a.825.825 0 00-.482 0c-.18.054-.326.139-.63.418l-.227.216L5.598 9.84c-.3.293-.385.39-.456.5a.76.76 0 00-.102.242c-.026.112-.037.224-.04.531l.002 6.807.005.073.074.006L8.999 18 9 14.268l.003-.17c.013-.448.083-.749.249-1.058a1.9 1.9 0 01.788-.788c.306-.164.6-.234 1.043-.249l.199-.003h1.45l.17.003c.448.013.749.083 1.058.249.337.18.608.45.788.788.164.306.234.6.249 1.043l.003.199L14.999 18l3.92-.002.073-.006.006-.073.002-.2v-6.615l-.005-.218a1.494 1.494 0 00-.035-.305.747.747 0 00-.102-.242l-.059-.084a3.571 3.571 0 00-.294-.315l-5.407-5.273c-.425-.414-.604-.545-.798-.615l-.06-.019z"
                        ></path>
                    </svg>
                </button> */}
            </div>
            <div className="right">
                {/* <button
                    type="button"
                    id="quick_add_task_holder"
                    data-track="navigation|quick_add"
                    aria-label="Quick Add"
                    className="top_bar_btn"
                    data-reach-tooltip-trigger=""
                >
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <g fill="none" fillRule="evenodd" transform="translate(4 3)">
                            <mask id="jd4FBg" fill="#fff">
                                <path d="M9 8h7a.5.5 0 1 1 0 1H9v7a.5.5 0 1 1-1 0V9H1a.5.5 0 0 1 0-1h7V1a.5.5 0 0 1 1 0v7z"></path>
                            </mask>
                            <g mask="url(#jd4FBg)">
                                <path fill="currentColor" d="M-4-3h24v24H-4z"></path>
                            </g>
                        </g>
                    </svg>
                </button> */}
                <button
                    type="button"
                    aria-owns="notification_popup"
                    aria-label="Notifications"
                    aria-controls="notification_popup"
                    aria-expanded="false"
                    aria-haspopup="listbox"
                    className="top_bar_btn notifications_btn"
                    onClick={() => setShowNotifyBox(true)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path
                            d="M12 3a5.75 5.75 0 015.75 5.75c0 3.24.682 5.875 2.03 7.927A1.5 1.5 0 0118.525 19H14.5a2.5 2.5 0 01-5 0H5.475a1.501 1.501 0 01-1.254-2.323C5.568 14.625 6.25 11.989 6.25 8.75A5.75 5.75 0 0112 3zm1.5 16h-3a1.5 1.5 0 003 0zM12 4a4.75 4.75 0 00-4.75 4.75c0 3.423-.731 6.248-2.193 8.476a.5.5 0 00.418.774h13.05a.5.5 0 00.418-.774c-1.462-2.227-2.193-5.053-2.193-8.476A4.75 4.75 0 0012 4z"
                            fill="currentColor"
                            fillRule="nonzero"
                        ></path>
                    </svg>
                </button>
                <button type="button" className="top_bar_btn user_btn" onClick={() => setShowUserOption(true)}>
                    <div className="div_avatar_default" />
                </button>
                <div className={is_show_user_option ? 'user_option active' : 'user_option'} ref={ref_user_option}>
                    {/* <div className="user_option_item">Cài đặt</div> */}
                    <div
                        className="user_option_item"
                        onClick={() => {
                            waterfall(
                                [
                                    (callback) => {
                                        auth.logout().then(() => {
                                            callback(null);
                                        });
                                    },
                                    (callback) => {
                                        auth.removeToken(() => {
                                            callback(null);
                                        });
                                    },
                                ],
                                () => {
                                    history.push('/login');
                                }
                            );
                        }}
                    >
                        Đăng xuất
                    </div>
                </div>
                <div className={is_show_notify_box ? 'user_option active notify_box' : 'user_option notify_box'} ref={ref_show_notify}>
                    <div className="title_notify">
                        <h5>Thông báo</h5>
                    </div>
                    <div className="body_notify">
                        <p className="text-muted">Bạn chưa có thông báo nào</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavTop;
