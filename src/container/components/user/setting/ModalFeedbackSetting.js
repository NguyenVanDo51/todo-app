/* eslint-disable prefer-destructuring */
/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Container } from 'react-bootstrap';
import waterfall from 'async/waterfall';
import toast from 'react-hot-toast';
import { Spin, Input} from '../../common/library';
import { created_feedback } from '../../../services/api/fetch';
import { UploadChunk } from '../../../helpers/UploadChunk';

class ModalFeedbackSetting extends Component {
    constructor(props) {
        super(props);
        this.focustextarea = React.createRef();
        const { profile } = this.props;
        this.state = {
            message: {
                description: '',
                attach: '',
            },
            formDataForm: null,
            loading: false,
        };
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
                    }
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

    handleCreateFeedback = () => {
        const { message, formDataForm } = this.state;
        const { onHide, profile } = this.props;
        //
        this.setState({ loading: true });
        const message_t = { ...message };
        waterfall([
            (callback) => {
                if (message && message.description.length > 0) {
                    callback(null, 'next');
                } else {
                    toast.error('Nội dung phản hồi không được để trống!', {
                    });
                    this.focustextarea.current.select();
                    this.setState({ loading: false });
                }
            },
            (next, callback) => {
                if (formDataForm !== null) {
                    const file = { ...formDataForm };
                    UploadChunk(file.files,null,(res) => {
                        if (res.status === 200) {
                            message_t.attach = res.data.url[0].url;
                            callback(null, res);
                        } else {
                            toast.error('Đã có lỗi xảy ra , vui lòng thử lại sau!', {
                                
                            });
                            this.setState({ loading: false });
                        }
                    })
                } else {
                    callback(null, 'next');
                }
            },
            (next, callback) => {
                message_t.fullname = profile.fullname;
                message_t.email = profile.email;
                message_t.type = 'question';
                message_t.phone = profile.phone;
                message_t.nameAttach = next.data ? next.data.url.file_name : null;
                message_t.sizeAttach = next.data ? next.data.url.file_size : null;
                message_t.typeAttach = next.data ? next.data.url.type : null;
                created_feedback(message_t).then((res) => {
                    if (res.mess) {
                        toast.success('Thành công!', {
                            
                        });
                    }
                    onHide();
                    this.setState({
                        loading: false,
                        formDataForm: null,
                    });
                }).catch(() => {
                    toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!', {
                        
                    });
                    this.setState({ loading: false });
                });
            },
        ], (err, result) => {
            toast.error('Đã có lỗi trong quá trình lấy dữ liệu!', {
                
            });
            this.setState({ loading: false });
        });
    }

    changeInput(type = '', e) {
        const { message } = this.state;
        const message_t = { ...message };
        const { value } = e.target;
        message_t[type] = value;
        this.setState({ message: message_t });
    }

    onHide = () => {
        const { onHide } = this.props;
        this.setState({ formDataForm: null });
        onHide();
    }

    render() {
        const { show, onHide, profile } = this.props;
        const { loading, formDataForm } = this.state;
        return (
            <Modal show={show} onHide={this.onHide} centered className="_report_modal">
                <Spin spin={loading}>
                    <Modal.Header closeButton>
                        <Modal.Title>Phản hồi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <div className="_popup_modal_contact_info">
                                <div className="_popup_modal_item">
                                    <div className="row">
                                        <div className="col-xl-2 col-lg-2 col-sm-2">
                                             <label>Họ tên:</label>
                                        </div>
                                        <div className="col-xl-10 col-lg-10 col-sm-10">
                                            <span>{profile.fullname}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="_popup_modal_item">
                                    <div className="row">
                                        <div className="col-xl-2 col-lg-2 col-sm-2">
                                             <label>Email:</label>
                                        </div>
                                        <div className="col-xl-10 col-lg-10 col-sm-10">
                                            <span>{profile.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="_popup_modal_item">
                                    <div className="row">
                                        <div className="col-xl-2 col-lg-2 col-sm-2">
                                             <label>SĐT:</label>
                                        </div>
                                        <div className="col-xl-10 col-lg-10 col-sm-10">
                                            <span>{profile.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="_popup_modal_content">
                                <label>Nội dung:</label>
                           
                                <textarea
                                    id="w3review"
                                    name="w3review"
                                    rows={4} cols={50}
                                    onChange={(e) => { this.changeInput('description', e); }}
                                    ref={this.focustextarea}
                                /> 
                                <div className="_popup_modal_content_avatar">
                                <input
                                    type="file"
                                    onChange={(e) => this.onChangeAvatar(e)}
                                    name="_popup_profile_avatar"
                                    id="_popup_modal_file"
                                    className="_popup_modal_filex"
                                    accept=".png, .jpg, .jpeg"
                                    style={{ display: 'none' }}
                                />
                                <div className="_popup_modal_item_label">
                                    <label htmlFor="_popup_modal_file">
                                    <i className="fal fa-paperclip" /> <span>Chọn tập tin đính kèm</span>
                                    </label>
                                </div>
                                { formDataForm ? <div className="_popup_modal_item_content">
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
                                            <i className="blo close-icon" onClick={() => {this.setState({ formDataForm: null })}}/>
                                        </div>
                                    </div> : null}
                            </div>
                        </div> 
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.onHide}>Hủy</Button>
                        <Button variant="primary" onClick={this.handleCreateFeedback} className="margin-left-8">Gửi</Button>
                    </Modal.Footer>
                </Spin>
            </Modal>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    profile: persist.profile,
});

export default withRouter(connect(mapStateToProps)(ModalFeedbackSetting));
