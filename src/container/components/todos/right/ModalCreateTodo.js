import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const ModalCreateTodo = ({
    is_show_modal,
    handle_show_modal_create_todo,
    todo_name_ref,
    input,
    handle_change_input,
    handle_create_todo,
}) => {
    useEffect(() => {
        if(todo_name_ref.current) {
            todo_name_ref.current.focus();
        }
    }, [is_show_modal]);

    return (
        <Modal show={is_show_modal} onHide={handle_show_modal_create_todo} centered className="work_modals">
            <Modal.Body>
                <div className="work_all_footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2>Tạo mới công việc</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="work_all_footer_col">
                                    {/* <label>
                                        Tên công việc <span className="text-danger">*</span>
                                    </label> */}
                                    <input
                                        autoFocus
                                        placeholder="Tên công việc"
                                        type="text"
                                        ref={todo_name_ref}
                                        value={input.title}
                                        onChange={(e) => handle_change_input(e, 'title')}
                                        onKeyUp={(e) => handle_change_input(e, 'title')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row margin-top-20">
                            <div className="col-12">
                                <div className="work_all_footer_col">
                                    <label>Ngày đến hạn</label>
                                    <input
                                        type="datetime-local"
                                        value={input.time_out}
                                        onChange={(e) => handle_change_input(e, 'time_out')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="work_modal_btn">
                                    <button
                                        type="button"
                                        className="work_modal_btn_reset"
                                        onClick={handle_show_modal_create_todo}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        className="work_modal_btn_add_new margin-left-8"
                                        type="button"
                                        onClick={handle_create_todo}
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCreateTodo;
