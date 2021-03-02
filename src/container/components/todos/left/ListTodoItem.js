/* eslint-disable no-underscore-dangle */
import React, { useState, useRef } from 'react';
import { Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import useOnClickOutside from '../../common/library/useOnClickOutside';

const ListTodoItem = ({ handle_show_modal_confirm_delete, change_show_list_todo, handle_show_edit_modal, category, menuActiveTodo }) => {
    const [show_todo_list_option, set_show_todo_list_option] = useState(false);
    const history = useHistory();

    const ref = useRef();

    useOnClickOutside(ref, () => set_show_todo_list_option(false));

    const handle_show_option = (e) => {
      set_show_todo_list_option(true);
      e.stopPropagation();
    };

    const handle_edit = (e) => {
      handle_show_edit_modal(category._id);
      e.stopPropagation();
    };

    const handle_delete = (e) => {
      handle_show_modal_confirm_delete(category._id);
      e.stopPropagation();
    };

    const handle_push_url = (e) => {
      history.push(`/app/${category._id}`);
    };

    return (
        <Nav.Item onClick={(e) => change_show_list_todo(category._id, category.name, e)}>
            <Nav.Link
              // href={`/app/${category._id}`}
              role="button"
              onClick={handle_push_url}
              className={menuActiveTodo === category._id ? ' active' : ''}
              style={category.color ? { color: category.color } : {}}
            >
            <i className="far fa-list" aria-hidden="true" />{category.name}
            <span className="_app_work_count" style={{ color: '#6A6A6A' }}>{category ? category.amount_todo : 0}</span>
            <span className="_app_work_selection" style={{ color: '#6A6A6A' }} onClick={handle_show_option}>
              <i className="far fa-ellipsis-h" />
            </span>
            {
                show_todo_list_option ? (
                    <div ref={ref} className="_app_work_selection_list">
                        <div className="_app_work_slect_list_item" onClick={handle_edit}>
                            <i className="icon-edit" /> Chỉnh sửa
                        </div>
                        <div className="_app_work_slect_list_item" onClick={handle_delete}><i className="icon-trash-open" /> Xóa</div>
                    </div>
                ) : null
            }
            </Nav.Link>
        </Nav.Item>
    );
};

export default ListTodoItem;
