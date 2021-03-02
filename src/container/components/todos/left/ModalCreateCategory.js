import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { SketchPicker } from 'react-color';
import { waterfall } from 'async';
import toast from 'react-hot-toast';
import { Spin } from '../../common/library';
import { api_create_category_todo } from '../../../api';
import { CHANGE_LIST_CATEGORY } from '../../../reducers/actions';

const ModalCreateCategory = ({
    change_show_list_todo,
    is_show_modal_category,
    handle_show_modal_category,
    get_categories,
}) => {
    const { profile, categories_todo } = useSelector(({ state, persist }) => ({
        profile: persist.profile,
        categories_todo: state.categories_todo,
    }));
    const [todo_name, set_todo_name] = useState('');
    const [todo_color, set_todo_color] = useState('');
    const [loading, set_loading] = useState(false);
    const [display_color_picker, set_display_color_picker] = useState(false);
    const todo_name_ref = React.createRef();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (todo_name_ref.current) {
            todo_name_ref.current.focus();
        }
        return set_display_color_picker(false);
    }, [is_show_modal_category]);

    // Tạo mới 1 category todo
    const handle_create_todo_category = () => {
        if (todo_name) {
            set_loading(true);
            
            api_create_category_todo({
                uid: profile.uid,
                name: todo_name,
                color: todo_color,
            }).then((category) => {
                waterfall([
                    (callback) => {
                        change_show_list_todo(category._id, category.name);
                        callback(null);
                    },
                    () => {
                        history.push(`/app/${category._id}`);
                    },
                ]);
                dispatch({ type: CHANGE_LIST_CATEGORY, payload: [...categories_todo, {...category, amount_todo: 0}] });
                set_loading(false);
                toast.success('Tạo danh sách thành công.');
                set_todo_name('');
                handle_show_modal_category();
            });
        } else {
            toast.error('Tên danh sách không được để trống!');
            todo_name_ref.current.focus();
        }
    };

    const handle_change_input = (e, type) => {
        if (e.keyCode === 13 && type === 'todo_name') {
            handle_create_todo_category();
        }
    };

    const handleClose = (target) => {
        if (target === 'close') {
            set_todo_color('');
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
                                Tạo danh sách công việc mới <span className="text-danger">*</span>
                            </h2>
                            <div className="work_modal_input">
                                <input
                                    className="mb-2"
                                    type="search"
                                    placeholder="Tên danh sách công việc"
                                    ref={todo_name_ref}
                                    value={todo_name}
                                    onChange={(e) => set_todo_name(e.target.value)}
                                    onKeyDown={(e) => handle_change_input(e, 'todo_name')}
                                />
                                <div className="_work_colorx">
                                    <div
                                        className="_work_colorxs"
                                        style={{ backgroundColor: todo_color || '' }}
                                        onClick={() => set_display_color_picker(!display_color_picker)}
                                    />
                                    {display_color_picker ? (
                                        <div className="v2_bota_ble_work_color_picker">
                                            <SketchPicker
                                                color={todo_color}
                                                onChange={(color) => set_todo_color(color.hex)}
                                            />
                                            <div style={{ marginTop: '15px' }}>
                                                <Button type="button" size="sm" onClick={handleClose}>
                                                    Xong
                                                </Button>
                                                <Button
                                                    type="button"
                                                    style={{ marginLeft: '10px' }}
                                                    size="sm"
                                                    onClick={() => handleClose('close')}
                                                >
                                                    Hủy
                                                </Button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                {/* </div> */}
                                {/* <div> */}
                            </div>
                            <div className="work_modal_btn">
                                <button type="button" className="work_modal_btn_reset" onClick={handle_show_modal_category}>
                                    Hủy
                                </button>
                                <button
                                    className="work_modal_btn_add_new margin-left-8"
                                    type="button"
                                    onClick={handle_create_todo_category}
                                >
                                    Tạo mới
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
