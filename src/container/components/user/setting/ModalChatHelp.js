/* eslint-disable no-unused-vars */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import waterfall from 'async/waterfall';
import toast from 'react-hot-toast';
import { Spin } from '../../common/library';
import { add_service_error } from '../../../services/api/fetch';
import { UploadChunk } from '../../../helpers/UploadChunk';
// import { isEmpty } from 'lodash';

class ModalChatHelp extends Component {
    constructor(props) {
        super(props);
        this.focusDomain = React.createRef();
        this.focustext = React.createRef();
        this.state = {
            message: null,
            loading: false,
            formDataForm: null,
        };
    }

    onHandleInput = (type = '', e) => {
        const { message } = this.state;
        const message_t = { ...message };
        const { value } = e.target;
        message_t[type] = value;
        this.setState({ message: message_t });
    }

    onHandleSubmit = () => {
        const { message, formDataForm } = this.state;
        const { onHideModalChatReport, profile } = this.props;
        const message_t = { ...message };
        this.setState({ loading: true });
        waterfall([
            (callback) => {
                if (message && message.domain.length > 0) {
                    callback(null);
                } else {
                    this.focusDomain.current.select();
                    toast.error('Tên miền không được để trống!', {
                    });
                    this.setState({ loading: false });
                }
            },
            (callback) => {
                if (this.validateDomain(message.domain) === true) {
                    callback(null);
                } else {
                    this.focusDomain.current.select();
                    toast.error('Tên miền không hợp lệ!', {
                    });
                    this.setState({ loading: false });
                }
            },
            (callback) => {
                if (message && message.request_customer && message.request_customer !== '') {
                    callback(null);
                } else {
                    toast.error('Dịch vụ không được để trống!', {
                    });
                    this.setState({ loading: false });
                }
            },
            (callback) => {
                if (message && message.mess && message.mess.length > 0) {
                    callback(null);
                } else {
                    toast.error('Nội dung yêu cầu không được để trống!', {
                    });
                    this.focustext.current.select();
                    this.setState({ loading: false });
                }
            },
            (callback) => {
                if (formDataForm !== null) {
                    const file = { ...formDataForm };
                    UploadChunk(file.files, null, (res) => {
                        if (res.status === 200) {
                            message_t.attach = res.data.url[0].url;
                            callback(null, res);
                        } else {
                            toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!', {
                            });
                            this.setState({ loading: false });
                        }
                    });
                } else {
                    callback(null);
                }
            },
            (callback) => {
                message_t.fullname = profile.fullname;
                message_t.email = profile.email;
                message_t.phone = profile.phone;
                message_t.uid = profile.uid;
                message_t.status = 0;
                add_service_error(message_t).then((res) => {
                    if (res.code === 200) {
                        toast.success('Thành công!', {
                        });
                        onHideModalChatReport(false);
                        this.setState({ loading: false, formDataForm: null });
                    } else if (res.code === 500) {
                        if (res.type === 'domain') {
                            this.focusDomain.current.select();
                        }
                        toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!', {
                        });
                        this.setState({ loading: false });
                    }
                });
            },
        ], (err, result) => {
            toast.error('Đã có lỗi xảy ra trong quá trình lấy dữ liệu!', {
            });
            this.setState({ loading: false });
        });
    }

    onChangeAvatar(e) {
        const { formDataForm } = this.state;
        this.setState({ loading: true });
        waterfall([
            (callback) => {
                this.setState({
                    formDataForm: {
                        ...formDataForm,
                        files: e.target.files,
                        url: URL.createObjectURL(e.target.files[0]),
                        name: e.target.files[0].name,
                        size: e.target.files[0].size,
                        type: e.target.files[0].type,
                    },
                });
                callback(null, 'next');
            },
            (next, callback) => {
                this.setState({ loading: false });
            },
        ], (err, result) => {
            toast.error('Có lỗi xảy ra trong quá trình lấy dữ liệu!', {
            });
            this.setState({ loading: false });
        });
    }

    validateDomain = (domain) => {
        // const reg = new RegExp('^(https?:\\/\\/)?' // protocol
        // + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
        // + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
        // + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
        // + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
        // + '(\\#[-a-z\\d_]*)?$', 'i');
        // return reg.test(domain);
        if (domain.endsWith('.com') || domain.endsWith('.vn')) {
            const re = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
            return re.test(domain);
        }
            return false;
    }

    render() {
        const { show, onHideModalChatReport } = this.props;
        const { loading, formDataForm } = this.state;
        return (
            <>
                <Modal show={show} centered className="_report_modal">
                <Spin spin={loading}>
                    <Modal.Header onHide={() => onHideModalChatReport(false)} closeButton>
                        <Modal.Title>Nhắn tin</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <div>
                                <div>
                                    <label className="">Tên miền</label>
                                    <input
                                        onChange={(e) => this.onHandleInput('domain', e)}
                                        ref={this.focusDomain}
                                    />
                                </div>
                                <div>
                                    <label>DỊCH VỤ YÊU CẦU</label>
                                    <select onChange={(e) => this.onHandleInput('request_customer', e)}>
                                        <option value="">Trạng thái</option>
                                        <option value="0">Cần gặp kinh doanh</option>
                                        <option value="1">Cần gặp CSKH</option>
                                    </select>
                                </div>
                                <div>
                                    <textarea ref={this.focustext} rows="4" cols="50" onChange={(e) => this.onHandleInput('mess', e)} />
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        onChange={(e) => this.onChangeAvatar(e)}
                                        name="_popup_profile_avatar"
                                        id="_popup_modal_file"
                                        className="_popup_modal_filex"
                                        accept=".png, .jpg, .jpeg"
                                        style={{ display: 'none' }}
                                    />
                                    <div className="_popup_modal_item_label _popup_filex">
                                        <label htmlFor="_popup_modal_file">
                                        <i className="fal fa-paperclip" /> <span>Chọn tập tin đính kèm</span>
                                        </label>
                                    </div>
                                    { formDataForm ? (
                                    <div className="_popup_modal_item_content">
                                        <div className="_popup_modal_item_img">
                                        <img
                                            src={formDataForm ? formDataForm.url : ''}
                                            alt=""
                                        />
                                        </div>
                                        <div className="_popup_modal_item_des">
                                            <h2>{formDataForm ? formDataForm.name : ''}</h2>
                                            <div>{formDataForm ? formDataForm.size : ''}</div>
                                            <div>{formDataForm ? formDataForm.type : ''}</div>
                                        </div>
                                        <div className="_popup_modal_item_trash">
                                            <i className="blo close-icon" onClick={() => { this.setState({ formDataForm: null }); }} />
                                        </div>
                                    </div>
) : null}
                                </div>
                            </div>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => onHideModalChatReport(false)}>Hủy</Button>
                        <Button variant="primary margin-left-8" onClick={this.onHandleSubmit}>Gửi</Button>
                    </Modal.Footer>
                </Spin>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    profile: persist.profile,
});

export default withRouter(connect(mapStateToProps)(ModalChatHelp));
