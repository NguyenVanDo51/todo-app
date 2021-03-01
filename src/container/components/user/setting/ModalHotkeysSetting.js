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

class ModalHotkeysSetting extends Component {
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
                toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!', {
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
            <Modal className="v2_bota_hotkeys_modal" show={show} onHide={onHide} centered>
                <Spin spin={loading}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cài đặt phím tắt</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row><Modal.Title>Thiết lập</Modal.Title></Row>
                            <Row>
                                <label style={{ height: '30px', width: '500px', display: 'flex' }} htmlFor="qtab">
                                    <Col xs={10}>
                                        <p>Chuyển tab nhanh: Ctrl + 1 /2 /3 /4</p>
                                    </Col>
                                    <Col xs={2}>
                                        <Checkbox type="checkbox" checked={setting.quicktab} onChange={(e) => this.onChangeInput(e, 'quicktab')} id="qtab" />
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

export default withRouter(connect(mapStateToProps)(ModalHotkeysSetting));
