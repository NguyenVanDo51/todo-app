/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import toast from 'react-hot-toast';
import { Button } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import bg_login from '../../../../style/scss/imgs/bg_login.png';
import avatar_default from '../../../../style/scss/imgs/avatar-default.png';
// import chat_setting_avatar_icon_edit from '../../../../style/scss/imgs/chat_setting_avatar_icon_edit.png';
import { api_update_profile, api_get_profile, get_positions_by_ids } from '../../../services/api/fetch';
import { Spin } from '../../common/library';
import { UploadChunk } from '../../../helpers/UploadChunk';
import { CHANGE_PROFILE } from '../../../reducers/thunk';

class ModalProfile extends Component {
    constructor(props) {
        super(props);
        const { profile } = this.props;
        this.state = {
            showInputEditFullName: false,
            showInputEditSubStatus: false,
            user: {
                ...profile,
            },
            isDisabledButtonUpdate: true,
            position: null,
        };
    }

    componentDidMount() {
        const { profile } = this.props;
        if (profile && !isEmpty(profile)) {
            get_positions_by_ids({ ids: profile.position_id }).then((res) => {
                if (res.status === 200 && !isEmpty(res.data.positions)) {
                    const position_title = res.data.positions[0].title;
                    this.setState({ position: position_title });
                } else {
                    this.setState({ position: 'Khách' });
                }
            });
        }
    }

    getProfile() {
        const { dispatch } = this.props;
        api_get_profile()
            .then((res) => {
                dispatch(CHANGE_PROFILE(res.profile));
            })
            .catch(() => {});
    }

    // Update avatar
    onChangeAvatar = (e) => {
        const { files } = e.target;
        const { setLoading } = this.props;
        if (!isEmpty(files)) {
            setLoading(true);
            UploadChunk(files, { type: 'avatar' }, (resp) => {
                setLoading(false);
                if (resp.status === 200) {
                    const { user } = this.state;
                    const profile_t = { ...user };
                    const { url } = resp.data;
                    profile_t.avatar = {
                        url: url[0].url,
                        // eslint-disable-next-line no-underscore-dangle
                        img_id: url[0]._id,
                        thumb90: url[0].thumb90,
                    };
                    this.setState({ user: profile_t });
                    this.handleUpdateProfile(false);
                } else {
                    toast.error('Có lỗi xảy ra vui lòng thử lại sau!', {
                    });
                }
            });
        }
    };

    // Xử lý update profile
    handleUpdateProfile = (isHideModal = true) => {
        const { user } = this.state;
        const { onHideModal, setLoading } = this.props;
        const profileUpdate = { ...user };
        api_update_profile(profileUpdate).then((res) => {
            this.setState({
                isDisabledButtonUpdate: true,
            });
            setLoading(false);

            if (isHideModal) {
                onHideModal();
            }
            if (res.data) {
                toast.success('Thao tác thành công');
            }
            this.getProfile();
        });
        setLoading(true);
    };

    // Xử lý chuyển đổi ô div thành input để sửa tên
    handleShowEditFullName = (e) => {
        if (e.keyCode === 13) {
            // Nếu nhấn phím enter sau khi nhập thì cập nhật fullname
            const { value } = e.target;
            if (value === '') {
                toast.error('Tên không được phép để trống!', {
                });
                const { profile } = this.props;
                const { user } = this.state;
                const user_t = { ...user };
                user_t.fullname = profile.fullname;
                this.setState({ user: user_t });
            } else {
                this.handleUpdateProfile(false);
            }
            this.setState({ showInputEditFullName: false });
        } else {
            this.setState({ showInputEditFullName: true });
        }
    };

    // Xử lý chuyển đổi ô div thành input để sửa sub_status
    handleShowEditSubStatus = (e) => {
        if (e.keyCode === 13) {
            this.handleUpdateProfile(false);
            this.setState({ showInputEditSubStatus: false });
        } else {
            this.setState({ showInputEditSubStatus: true });
        }
    };

    // Xử lý chuyển ô input sửa tên thành lại 1 div
    handleHiddenEditInput = (e, type = '') => {
        const { showInputEditFullName, showInputEditSubStatus, user } = this.state;
        const sub_status_t = user.sub_status ? user.sub_status : '';
        if (type !== 'fullname' && showInputEditFullName && e.target.value !== user.fullname) {
            this.setState({ showInputEditFullName: false });
        }
        if (type !== 'sub_status' && showInputEditSubStatus && e.target.value !== sub_status_t) {
            this.setState({ showInputEditSubStatus: false });
        }
    };

    // onchange chung cho các ô input
    onChangeInput = (type, e) => {
        const { user } = this.state;
        const userTemp = { ...user };
        const { value } = e.target;
        if (type === 'day' || type === 'month' || type === 'year') {
            if (value !== '') {
                userTemp.birthday[type] = parseInt(value);
            }
        } else if (type === 'sub_status' && value.length > 255) {
        } else {
            userTemp[type] = value;
        }
        if (type !== 'fullname' && type !== 'sub_status') {
            this.setState({ isDisabledButtonUpdate: false });
        }
        this.setState({ user: userTemp });
    };

    render() {
        const { showInputEditFullName, user, isDisabledButtonUpdate, position } = this.state;
        const { profile, onHideModal, loading } = this.props;
        const days = [];
        const months = [];
        const years = [];
        if (!profile.birthday.day !== 0) {
            days.push(<option key="day-0" value=""> Ngày </option>);
        }
        if (!profile.birthday.month !== 0) {
            months.push(<option key="month-0" value="">Tháng</option>);
        }
        if (!profile.birthday.year !== 1900) {
            years.push(<option key="year-0" value="">Năm</option>);
        }
        for (let i = 1; i < 32; i++) {
            days.push(<option key={`day-${i}`} value={i}>{i < 10 ? `0${i}` : i}</option>);
        }
        for (let i = 1; i < 13; i++) {
            months.push(<option key={`month-${i}`} value={i}>{i < 10 ? `0${i}` : i}</option>);
        }
        for (let i = 1960; i < 2001; i++) {
            years.push(<option key={`year-${i}`} value={i}>{i}</option>);
        }

        return (
            <Spin spin={loading}>
                <div className="_popup_modal_container" onMouseDown={this.handleHiddenEditInput}>
                    <div className="_popup_modal_dialog">
                        <div className="_popup_modal_dialog_header">
                            <h5>Cập nhật thông tin</h5>
                            <span className="_popup_close" onClick={onHideModal}>
                                <i className="blo close-icon" />
                            </span>
                        </div>
                        <div className="_popup_modal_body">
                            <div className="_popup_modal_content">
                                <div className="_popup_modal_content_bg">
                                    <div className="_popup_modal_contentx">
                                        <img src={bg_login} alt="hình nền" />
                                        <div className="_popup_modal_content_avatar">
                                            <input
                                                type="file"
                                                onChange={this.onChangeAvatar}
                                                name="_popup_profile_avatar"
                                                id="_popup_profile_avatar_picker"
                                                className="_popup_input_file"
                                                accept=".png, .jpg, .jpeg"
                                                style={{ display: 'none' }}
                                            />
                                            <label htmlFor="_popup_profile_avatar_picker">
                                                <img src={profile.avatar ? `${profile.avatar.thumb90}` ? `${profile.avatar.thumb90}` : avatar_default : avatar_default} alt="ảnh đại diện" className="_popup_avatar" />
                                                <i className="far fa-camera _popup_avatar_edit" />
                                            </label>
                                        </div>
                                        <div className="_popup_profile_update">
                                            <div className="_popup_profile_update_field">
                                                <div className="_popup_profile_update_field_ovf_hidden">
                                                    <div className="_popup_text_content_container">
                                                        <div className="_popup_input_edit_container">
                                                            <input className="input _popup_input_edit" maxLength={40} placeholder="Nhập tên... " />
                                                        </div>
                                                        <div className="_popup_text_content _popup_input_display_container">
                                                            {!showInputEditFullName ? (
                                                                <>
                                                                    <div className="_popup_input_text_profile_name">
                                                                        {user.fullname}{' '}
                                                                        <span>
                                                                            <i className="fal fa-pen" title="Cập nhật tên hiển thị" onClick={this.handleShowEditFullName} />
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="_popup_input_edit_container" style={{ display: 'flex' }}>
                                                                        <input
                                                                            className="input _popup_input_edit"
                                                                            data-for="fullname"
                                                                            placeholder="Nhập tên... "
                                                                            type="text"
                                                                            value={user.fullname}
                                                                            onKeyDown={(e) => this.handleShowEditFullName(e)}
                                                                            onClick={(e) => this.handleHiddenEditInput(e, 'fullname')}
                                                                            onChange={(e) => this.onChangeInput('fullname', e)}
                                                                        />
                                                                        <div className="_input_edit_actionx">
                                                                            <span>
                                                                                <i className="fal fa-check" />
                                                                            </span>
                                                                            <span>
                                                                                <i className="fal fa-times" />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="_profile_update_infos">
                                                <div className="_profile_update_item">
                                                    <div className="row">
                                                        <div className="col-xl-3 col-lg-3 col-sm-3">
                                                            <h2>Chức vụ:</h2>
                                                        </div>
                                                        <div className="col-xl-9 col-lg-9 col-sm-9">
                                                            <div className="_profile_update_item_cont">{position}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="_profile_update_item">
                                                    <div className="row">
                                                        <div className="col-xl-3 col-lg-3 col-sm-3">
                                                            <h2>Email:</h2>
                                                        </div>
                                                        <div className="col-xl-9 col-lg-9 col-sm-9">
                                                            <div className="_profile_update_item_cont">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="_profile_update_item">
                                                    <div className="row">
                                                        <div className="col-xl-3 col-lg-3 col-sm-3">
                                                            <h2>Số điện thoại:</h2>
                                                        </div>
                                                        <div className="col-xl-9 col-lg-9 col-sm-9">
                                                            <div className="_profile_update_item_cont">{user.phone}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="_profile_update_item">
                                                    <div className="row">
                                                        <div className="col-xl-3 col-lg-3 col-sm-3">
                                                            <h2>Ngày sinh</h2>
                                                        </div>
                                                        <div className="col-xl-9 col-lg-9 col-sm-9">
                                                            <div className="_popup_datepicker">
                                                                <div className="_popup_datepicker_group">
                                                                    <div className="_popup_select_box">
                                                                        <select required value={profile.birthday.day || ''} className="dateofbirth" onChange={(e) => this.onChangeInput('day', e)}>
                                                                            {days}
                                                                        </select>
                                                                    </div>
                                                                    <div className="_popup_select_box">
                                                                        <select required value={profile.birthday.month || ''} className="monthofbirth" onChange={(e) => this.onChangeInput('month', e)}>
                                                                            {months}
                                                                        </select>
                                                                    </div>
                                                                    <div className="_popup_select_box">
                                                                        <select required value={profile.birthday.year || ''} className="monthofbirth" onChange={(e) => this.onChangeInput('year', e)}>
                                                                            {years}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="_profile_update_item">
                                                    <div className="row">
                                                        <div className="col-xl-3 col-lg-3 col-sm-3">
                                                            <h2> Giới tính</h2>
                                                        </div>
                                                        <div className="col-xl-9 col-lg-9 col-sm-9">
                                                            <div className="_popup_profile_gender">
                                                                <label>
                                                                    <div className="_gender_dlex">
                                                                        <input onChange={(e) => this.onChangeInput('gender', e)} type="radio" value={1} checked={Number(user.gender) === 1} name="gender" />
                                                                        <span className="checkmark" /> Nam
                                                                    </div>
                                                                </label>
                                                                <label>
                                                                    <div className="_gender_dlex">
                                                                        <input onChange={(e) => this.onChangeInput('gender', e)} type="radio" value={2} checked={Number(user.gender) === 2} name="gender" />
                                                                        <span className="checkmark" /> Nữ
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="_popup_modal_footer">
                            <Button variant="secondary" className="_popup_btn_reset" onClick={onHideModal}>
                                Hủy
                            </Button>
                            <Button variant="primary" className="_popup_btn_update margin-left-8" type="button" disabled={isDisabledButtonUpdate} onClick={this.handleUpdateProfile}>
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    profile: persist.profile,
});

export default withRouter(connect(mapStateToProps)(ModalProfile));
