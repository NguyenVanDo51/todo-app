import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { api_update_todo } from '../../../api';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { CHANGE_LIST_TODO } from '../../../reducers/actions';

const renderTooltip = (props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Tooltip id="button-tooltip" {...props}>
        Đánh dấu là đã xong
    </Tooltip>
);
const renderTooltipx = (props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Tooltip id="button-tooltip" {...props}>
        Đánh dấu là quan trọng
    </Tooltip>
);

const TodoItem = (props) => {
    const [loading, set_loading] = useState(false);
    const { todo_item, getTodo, update_todo, handle_show_modal_option, todos, dispatch } = props;

    // Thay đổi is_complete
    const handleChangIsComplete = (e) => {
        const todo_params = { is_complete: e.target.checked ? 1 : 0 };
        if (todo_item.repeat && todo_item.repeat.type && e.target.checked) {
            if (loading) return;
            set_loading(true);

            dispatch({
                type: CHANGE_LIST_TODO,
                payload: {
                    todos: todos.map((todo) => {
                        if (todo._id === todo_item._id) {
                            return { ...todo, ...todo_params };
                        }
                        return todo;
                    }),
                },
            });

            api_update_todo(todo_item._id, todo_params).then(() => {
                set_loading(false);
                getTodo();
            });
        } else update_todo(todo_item._id, todo_params);
    };

    let is_time_out = null;
    if (todo_item.time_out) {
        const time_out = new Date(todo_item.time_out);
        const currentDate = new Date();
        const minutes = time_out.getMinutes() < 10 ? `0${time_out.getMinutes()}` : time_out.getMinutes();
        const hours = time_out.getHours() < 10 ? `0${time_out.getHours()}` : time_out.getHours();
        const date = time_out.getDate() < 10 ? `0${time_out.getDate()}` : time_out.getDate();
        const month = time_out.getMonth();
        const year = time_out.getFullYear();
        if (
            year === currentDate.getFullYear() &&
            month === currentDate.getMonth() &&
            parseInt(date) === currentDate.getDate()
        ) {
            if (parseInt(hours) > currentDate.getHours()) {
                is_time_out = <span className="text-warning">{`Đến hạn hôm nay vào lúc ${hours}:${minutes}`}</span>;
            } else if (parseInt(hours) === currentDate.getHours()) {
                if (parseInt(minutes) > currentDate.getMinutes()) {
                    is_time_out = <span className="text-warning">{`Đến hạn hôm nay vào lúc ${hours}:${minutes}`}</span>;
                } else {
                    is_time_out = (
                        <span className="text-danger">{`Quá hạn, ${date}/${
                            month < 9 ? `0${month + 1}` : month + 1
                        }/${year} ${hours}:${minutes}`}</span>
                    );
                }
            } else {
                is_time_out = (
                    <span className="text-danger">{`Quá hạn, ${date}/${
                        month < 9 ? `0${month + 1}` : month + 1
                    }/${year} ${hours}:${minutes}`}</span>
                );
            }
            // eslint-disable-next-line eqeqeq
        } else if (time_out < currentDate && parseInt(date) < currentDate.getDate()) {
            is_time_out = (
                <span className="text-danger">{`Quá hạn, ${date}/${
                    month < 9 ? `0${month + 1}` : month + 1
                }/${year} ${hours}:${minutes}`}</span>
            );
        } else {
            is_time_out = (
                <span>{`Đến hạn ngày ${date}/${month < 9 ? `0${month + 1}` : month + 1}/${year} ${hours}:${minutes}`}</span>
            );
        }
    }

    return (
        <>
            <div className="work_all_content_fitter_item_toolbar" key={todo_item.id}>
                <div className="work_all_content_fitter_item">
                    <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                        <label>
                            <div className="work_all_content_fitter_item_checkbox">
                                <div className="work_all_content_fitter_item_checkboxs">
                                    <input
                                        type="checkbox"
                                        disabled={loading}
                                        checked={todo_item.is_complete}
                                        onChange={handleChangIsComplete}
                                    />
                                    <span />
                                </div>
                            </div>
                        </label>
                    </OverlayTrigger>
                    <div className="work_all_content_fitter_item_name">
                        <h2
                            className={todo_item.time_out ? '' : 'had_time_out'}
                            style={todo_item.is_complete ? { textDecoration: 'line-through' } : {}}
                        >
                            {todo_item.title}
                        </h2>
                        <div className="work_all_content_fitter_item_date">{is_time_out}</div>
                    </div>
                </div>
                <div className="work_all_content_fitter_item_action">
                    <div className="work_all_content_fitter_dot" onClick={() => handle_show_modal_option(todo_item)}>
                        <i className="far fa-ellipsis-h" />
                    </div>
                    <div
                        className={
                            todo_item.is_important ? 'work_all_content_fitter_star active' : 'work_all_content_fitter_star'
                        }
                        onClick={() => update_todo(todo_item._id, { is_important: todo_item.is_important ? 0 : 1 })}
                    >
                        <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltipx}>
                            <i className="fal fa-star" />
                        </OverlayTrigger>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = ({ state }) => ({
    todos: state.todos,
});

export default withRouter(connect(mapStateToProps)(TodoItem));
