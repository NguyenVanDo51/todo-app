/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import Checkbox from 'rc-checkbox';
import toast from 'react-hot-toast';
import { Spin } from '../../common/library';
import { api_get_profile, api_update_profile } from '../../../services/api/fetch';
import { CHANGE_PROFILE } from '../../../reducers/thunk';
import 'rc-checkbox/assets/index.css';

class ModalPrivacySetting extends Component {
    constructor(props) {
        super(props);
        const { profile } = this.props;
        this.state = {
            setting: {
                ...profile.setting_common,
            },
        };
        this.handleUpdateSetting = this.handleUpdateSetting.bind(this);
    }

    getProfile() {
        const { dispatch } = this.props;
        api_get_profile().then((res) => {
            dispatch(CHANGE_PROFILE(res.profile));
        }).catch(() => { });
    }

    handleUpdateSetting() {
        const { setting } = this.state;
        const { setLoading, onHide, profile } = this.props;
        const profileUpdate = { ...profile, setting_common: setting };
        api_update_profile(profileUpdate).then((res) => {
            if (res.data) {
                toast.success('Thành công!', {
                });
            }
            onHide();
            setLoading(false);
            this.getProfile();
        })
            .catch(() => {
                toast.error('Có lỗi xảy ra, vui lòng thử lại sau!', {
                });
                setLoading(false);
            });
        setLoading(true);
    }

    onChangeInput(e, type = '') {
        const { setting } = this.state;
        const setting_t = { ...setting };
        const { checked } = e.target;
        setting_t[type] = checked ? 1 : 0;
        this.setState({ setting: setting_t });
    }

    render() {
        const { setting } = this.state;
        const { show, onHide, loading } = this.props;
        return (
            <Modal className="_modal" show={show} onHide={onHide} centered>
                <Spin spin={loading}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cài đặt cá nhân</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row><Modal.Title>Thiết lập</Modal.Title></Row>
                            <Row>
                                <label style={{ height: '30px', width: '500px', display: 'flex' }} htmlFor="his">
                                    <Col xs={10}>
                                        <p>Xóa lịch sử trò chuyện khi đăng xuất</p>
                                    </Col>
                                    <Col xs={2}>
                                        <Checkbox type="checkbox" checked={setting.delete_history} onChange={(e) => this.onChangeInput(e, 'delete_history')} id="his" />
                                    </Col>
                                </label>
                            </Row>
                            <Row>
                                <label style={{ height: '30px', width: '500px', display: 'flex' }} htmlFor="seen">
                                    <Col xs={10}>
                                        <p>Mở cửa sổ xác nhận "Đánh dấu đã đọc"</p>
                                    </Col>
                                    <Col xs={2}>
                                        <Checkbox type="checkbox" checked={setting.open_modal_readed} onChange={(e) => this.onChangeInput(e, 'open_modal_readed')} id="seen" />
                                    </Col>
                                </label>
                            </Row>
                            <Row>
                                <label style={{ height: '30px', width: '500px', display: 'flex' }} htmlFor="done">
                                    <Col xs={10}>
                                        <p>Mở cửa sổ xác nhận hoàn thành công việc</p>
                                    </Col>
                                    <Col xs={2}>
                                        <Checkbox type="checkbox" checked={setting.open_modal_work_finished} onChange={(e) => this.onChangeInput(e, 'open_modal_work_finished')} id="done" />
                                    </Col>
                                </label>
                            </Row>
                            <Row>
                                <label style={{ height: '30px', width: '500px', display: 'flex' }} htmlFor="reopen">
                                    <Col xs={10}>
                                        <p>Mở cửa sổ xác nhận mở lại công việc</p>
                                    </Col>
                                    <Col xs={2}>
                                        <Checkbox type="checkbox" checked={setting.open_modal_reopen_work} onChange={(e) => this.onChangeInput(e, 'open_modal_reopen_work')} id="reopen" />
                                    </Col>
                                </label>
                            </Row>
                            <Row><Modal.Title>Thông báo</Modal.Title></Row>
                            <Row>
                                <label style={{ height: '30px', width: '500px', display: 'flex' }} htmlFor="alert">
                                    <Col xs={10}>
                                        <p>Âm báo (tin nhắn, thông báo mới)</p>
                                    </Col>
                                    <Col xs={2}>
                                        <Checkbox type="checkbox" checked={setting.notification} onChange={(e) => this.onChangeInput(e, 'notification')} id="alert" />
                                    </Col>
                                </label>
                            </Row>
                            <Row>
                                <label style={{ height: '30px', width: '500px', display: 'flex' }} htmlFor="popup">
                                    <Col xs={10}>
                                        <p>Popup báo tin nhắn mới (desktop)</p>
                                    </Col>
                                    <Col xs={2}>
                                        <Checkbox type="checkbox" checked={setting.popup_new_message} onChange={(e) => this.onChangeInput(e, 'popup_new_message')} id="popup" />
                                    </Col>
                                </label>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>Hủy</Button>
                        <Button variant="primary" onClick={this.handleUpdateSetting} className="margin-left-8">Cập nhật</Button>
                    </Modal.Footer>
                </Spin>
            </Modal>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    profile: persist.profile,
});

export default withRouter(connect(mapStateToProps)(ModalPrivacySetting));
