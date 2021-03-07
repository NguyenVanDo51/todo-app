import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Modal, Button } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import { Spin } from '../../common/library';
import { api_edit_category_todo } from '../../../api';
import { CHANGE_LIST_CATEGORY } from '../../../reducers/actions';

const ModalCreateCategory = ({ is_show_modal_category, category_choose, handle_show_modal_category, categories_todo }) => {
    const [todo_name, set_todo_name] = useState('');
    const [todo_color, set_todo_color] = useState('');
    const [loading, set_loading] = useState(false);
    const [display_color_picker, set_display_color_picker] = useState(false);
    const [color_default, set_color_default] = useState(false);
    const todo_name_ref = React.createRef();
    const dispatch = useDispatch();

    useEffect(() => {
        if (todo_name_ref.current) {
            todo_name_ref.current.focus();
        }
        if (category_choose) {
            // api_get_one_category_todo(category_choose).then((data) => {
                // if (data) {
                    set_todo_name(category_choose.name);
                    set_todo_color(category_choose.color);
                    set_color_default(category_choose.color);
                // }
                set_loading(false);
            // });
        }

        return function cleanup() {
            set_todo_color('');
            set_todo_name('');
            set_display_color_picker(false);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_show_modal_category]);

    const handle_update_todo_category = () => {
        if (todo_name) {
            set_todo_name('');
            handle_show_modal_category();

            const params = {
                name: todo_name,
                color: todo_color,
            };

            dispatch({
                type: CHANGE_LIST_CATEGORY,
                payload: categories_todo.map((category) => {
                    if (category._id === category_choose._id)
                        return {
                            ...category,
                            ...params,
                        };
                    return category;
                }),
            });
            api_edit_category_todo(category_choose._id, params).then((res) => {
                if (!res) {
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại');
                }
            });
        } else {
            toast.dismiss();
            toast.error('Tên danh sách không được để trống!');
            todo_name_ref.current.focus();
        }
    };

    const update_category_by_enter = (e, type) => {
        if (e.keyCode === 13 && type === 'todo_name') {
            handle_update_todo_category();
        }
    };

    const handleClose = (target) => {
        if (target === 'close') {
            set_todo_color(color_default);
        }
        set_display_color_picker(false);
        if (todo_name_ref.current) {
            todo_name_ref.current.focus();
        }
    };

    return (
        <>
            <Modal show={is_show_modal_category} onHide={handle_show_modal_category} centered className="work_modals">
                <Spin spin={loading}>
                    <div className="work_modal">
                        <div className="work_modal_content">
                            <h2>
                                Chỉnh sửa danh sách công việc <span className="text-danger">*</span>
                            </h2>
                            <div className="work_modal_input">
                                <input
                                    className="mb-2"
                                    type="search"
                                    placeholder="Tên danh sách công việc"
                                    ref={todo_name_ref}
                                    value={todo_name}
                                    onChange={(e) => set_todo_name(e.target.value)}
                                    onKeyDown={(e) => update_category_by_enter(e, 'todo_name')}
                                />
                                <div className="_work_colorx">
                                    <div
                                        className="_work_colorxs"
                                        style={{ backgroundColor: todo_color || '' }}
                                        onClick={() => set_display_color_picker(!display_color_picker)}
                                    />
                                    {display_color_picker ? (
                                        <div className="v2_bota_ble_work_color_picker">
                                            <SketchPicker color={todo_color} onChange={(color) => set_todo_color(color.hex)} />
                                            <div style={{ marginTop: '15px' }}>
                                                <Button type="button" size="sm" onClick={handleClose}>
                                                    Xong
                                                </Button>
                                                <Button type="button" style={{ marginLeft: '10px' }} size="sm" onClick={() => handleClose('close')}>
                                                    Hủy
                                                </Button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="work_modal_btn">
                                <button type="button" className="work_modal_btn_reset" onClick={handle_show_modal_category}>
                                    Hủy
                                </button>
                                <button className="work_modal_btn_add_new margin-left-8" type="button" onClick={handle_update_todo_category}>
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};

export default ModalCreateCategory;
