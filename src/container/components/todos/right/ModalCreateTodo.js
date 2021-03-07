import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { api_create_todo } from '../../../api';
import { CHANGE_LIST_TODO, CHANGE_SORT_BY, CHANGE_LIST_CATEGORY } from '../../../reducers/actions';
import toast from 'react-hot-toast';

const ModalCreateTodo = ({ is_show_modal, handle_show_modal_create_todo, todos, category_id }) => {
    const [input, setInput] = useState({
        title: '',
        time_out: '',
    });
    const todo_name_ref = useRef();
    const dispatch = useDispatch();
    let { categories_todo } = useSelector(({ state }) => ({
        categories_todo: state.categories_todo,
    }));

    // Gọi API tạo mới todo
    const handle_create_todo = () => {
        let input_t = { ...input, category_id };
        handle_show_modal_create_todo(false);
        if (input_t.title) {
            if (input_t.time_out && typeof input_t.time_out === 'string') input_t.time_out = new Date(input_t.time_out).getTime();
            input_t.created_at = new Date().getTime();
            setInput({ title: '', time_out: '' });
            dispatch({ type: CHANGE_SORT_BY, payload: { sort: { sort_by: '', reverse: '' } } });
            api_create_todo(input_t).then((res) => {
                if (res) {
                    dispatch({
                        type: CHANGE_LIST_TODO,
                        payload: {
                            todos: [...todos, { ...res.data }],
                        },
                    });

                    categories_todo[0].amount_all += 1;
                    categories_todo.every((category, index) => {
                        if (category._id === category_id) {
                            categories_todo[index].amount_todo += 1;
                            return false;
                        }
                        return true;
                    });
                    dispatch({ type: CHANGE_LIST_CATEGORY, payload: categories_todo });
                } else {
                    toast.dismiss();
                    toast.error('Đã xảy ra lỗi khi tạo công việc');
                }
            });
        } else {
            toast.dismiss();
            toast.error('Tên công việc không thể để trống.');
            todo_name_ref.current.focus();
        }
    };

    // Xử lý onChange của ô input thêm mới 1 todo
    const handle_change_input = (e, type = '') => {
        if (e.keyCode === 13 && type === 'title') {
            handle_create_todo();
        } else {
            const value = e.target.value || '';
            if (value.length < 255) {
                const input_t = { ...input };
                input_t[type] = value;
                setInput(input_t);
            }
        }
    };

    useEffect(() => {
        if (todo_name_ref.current) {
            todo_name_ref.current.focus();
        }
    }, [is_show_modal, todo_name_ref]);

    return (
        <Modal show={is_show_modal} onHide={() => handle_show_modal_create_todo(false)} centered className="work_modals">
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
                                    <input type="datetime-local" value={input.time_out} onChange={(e) => handle_change_input(e, 'time_out')} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="work_modal_btn">
                                    <button type="button" className="work_modal_btn_reset" onClick={() => handle_show_modal_create_todo(false)}>
                                        Hủy
                                    </button>
                                    <button className="work_modal_btn_add_new margin-left-8" type="button" onClick={handle_create_todo}>
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
