import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function Confirm(props) {
    const { show, onClose, onOk, mess, title } = props;
    return (
        <Modal show={show} centered onHide={onClose} className="_popup pop_edit_profile">
            <div className="_popup_modal_container">
                <div className="_popup_modal_dialog">
                    <div className="_popup_modal_dialog_header">
                        <h5>{title !== undefined ? title : 'Xác nhận'}</h5>
                        <span
                            className="_popup_close"
                            onClick={onClose}
                        >
                            <i className="blo close-icon" />
                        </span>
                    </div>
                    <div className="_popup_modal_body">
                        <div className="m-3">
                            {mess}
                        </div>
                    </div>
                    <div className="_popup_modal_footer">
                        <Button variant="secondary" className="_popup_btn_reset" onClick={onClose}>Hủy</Button>
                        <Button variant="primary" className="_popup_btn_delete margin-left-8" type="button" onClick={onOk}>Đồng ý</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default (Confirm);
