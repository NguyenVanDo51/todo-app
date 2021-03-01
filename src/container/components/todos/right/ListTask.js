import React, { Component, Suspense } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { api_update_todo } from '../../../api';
import { Spin } from '../../common/library';

const TodoItem = React.lazy(() => import('./TodoItem'));
const ModalShowTodo = React.lazy(() => import('./ModalShowTodo'));

class ListTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            is_show_modal_opion: false,
            todo_choose: {},
        };
    }

    // Mở modal tùy chọn cho 1 todoyyy
    handle_show_modal_option = (todo) => {
        const { is_show_modal_opion } = this.state;
        if (is_show_modal_opion) {
            const { getTodo } = this.props;
            getTodo();
        }
        this.setState({ is_show_modal_opion: !is_show_modal_opion, todo_choose: todo });
    };

    set_loading = (is_load) => {
        this.setState({ loading: is_load });
    };

    // Xử lý cập nhật 1 todo
    update_todo = (todo_id, todo_param) => {
        const { loading } = this.state;
        if (loading) return;
        this.set_loading(true);
        api_update_todo(todo_id, todo_param).then((res) => {
            if (res) {
                const { getTodo } = this.props;
                getTodo();
                this.set_loading(false);
            } else {
                toast.dismiss();
                toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
            }
        });
    };

    // render các task đã hoàn thành
    render_is_completed = () => {
        const { getTodo, todos, get_categories } = this.props;
        return (
            todos &&
            todos.map((todo_item) =>
                todo_item.is_complete ? (
                    <Suspense fallback={<div className="d-none">Loading...</div>} key={todo_item._id}>
                        <TodoItem
                            todo_item={todo_item}
                            getTodo={getTodo}
                            get_categories={get_categories}
                            handle_show_modal_option={this.handle_show_modal_option}
                            update_todo={this.update_todo}
                        />
                    </Suspense>
                ) : null
            )
        );
    };

    // render các task chưa hoàn thành
    render_is_not_completed = () => {
        const { getTodo, todos, get_categories } = this.props;
        return (
            todos &&
            todos.map((todo_item) =>
                !todo_item.is_complete ? (
                    <Suspense fallback={<div className="d-none">Loading...</div>} key={todo_item._id}>
                        <TodoItem
                            todo_item={todo_item}
                            getTodo={getTodo}
                            get_categories={get_categories}
                            handle_show_modal_option={this.handle_show_modal_option}
                            update_todo={this.update_todo}
                        />
                    </Suspense>
                ) : null
            )
        );
    };

    render() {
        const { category, getTodo } = this.props;
        const { todo_choose, is_show_modal_opion, loading } = this.state;

        return (
            <>
                <div className="work_all_content_scoll">
                    <Spin spin={loading}>
                        <div className="work_all_content_fitter">
                            <div className="container">{this.render_is_not_completed()}</div>
                        </div>
                        {/* HIEN THI DANH SACH TODO */}
                        <div className="work_all_completed">
                            <div className="container">
                                {category !== 'completed' ? (
                                    <div className="work_all_completed_title">
                                        <h2>
                                            Công việc đã hoàn thành <i className="blo caret-down" />
                                        </h2>
                                    </div>
                                ) : null}
                                <div className="work_all_completed_content">{this.render_is_completed()}</div>
                            </div>
                        </div>
                    </Spin>
                </div>
                {/* MODAL Tùy chọn cho 1 todo */}
                {is_show_modal_opion && (
                    <Modal show={is_show_modal_opion} centered className="work_modals" onHide={() => {}}>
                        <Suspense fallback={<div className="d-none">Loading...</div>}>
                            <ModalShowTodo
                                todo_choose={todo_choose}
                                handle_show_modal_option={this.handle_show_modal_option}
                                getTodo={getTodo}
                                update_todo={this.update_todo}
                            />
                        </Suspense>
                    </Modal>
                )}
            </>
        );
    }
}

export default ListTask;
