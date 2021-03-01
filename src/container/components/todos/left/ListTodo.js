import React, { Component, Suspense } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import toast from 'react-hot-toast';
import { Modal, Nav, Button } from 'react-bootstrap';
import { api_get_todos, api_delete_category_todo, api_get_category_todo } from '../../../api';
import { Spin } from '../../common/library';
import {
    CHANGE_LIST_TODO,
    CHANGE_LIST_TODO_NAME,
    CHANGE_LOADING_TODO,
    CHANGE_SEARCH_TODO,
    CHANGE_LIST_CATEGORY,
} from '../../../reducers/actions';
import ListTodoItem from './ListTodoItem';

const ModalCreateCategory = React.lazy(() => import('./ModalCreateCategory'));
const ModalEditCategory = React.lazy(() => import('./ModalEditCategory'));

class ListTodo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            is_show_create_modal: false,
            is_show_edit_modal: false,
            is_show_modal_confirm_delete: false,
            category_choose_id: null,
        };
    }

    handle_show_modal_confirm_delete = (category_id = null) => {
        const { is_show_modal_confirm_delete } = this.state;
        if (!is_show_modal_confirm_delete) {
            document.addEventListener('keyup', this.handle_enter_delete_category);
        } else {
            document.removeEventListener('keyup', this.handle_enter_delete_category);
        }
        this.setState({ is_show_modal_confirm_delete: !is_show_modal_confirm_delete, category_choose_id: category_id });
    };

    handle_enter_delete_category = (e) => {
        if (e.keyCode === 13) {
            this.handle_delete_todo_category();
        }
    };

    set_loading = (is_load = false) => {
        this.setState({ loading: is_load });
    };

    // Get list todo
    change_show_list_todo = (caregory_id, title) => {
        const { dispatch, menuActiveTodo, sort, categories_todo } = this.props;
        if (menuActiveTodo === caregory_id) return;
        const p = {};
        switch (caregory_id) {
            case 'task':
                p.category_id = 'all';
                break;
            case 'important':
                p.category_id = 'important';
                break;
            default:
                p.category_id = caregory_id;
                break;
        }
        p.sort_by = sort.sort_by;
        p.reverse = sort.reverse;
        if (title !== 'added') {
            dispatch({ type: CHANGE_LIST_TODO_NAME, payload: { todo_category_name: title } });
        } else {
            categories_todo &&
                categories_todo.every((category) => {
                    // eslint-disable-next-line no-underscore-dangle
                    if (category._id === caregory_id) {
                        dispatch({ type: CHANGE_LIST_TODO_NAME, payload: { todo_category_name: category.name } });
                        return false;
                    }
                    return true;
                });
        }
        dispatch({ type: CHANGE_LOADING_TODO, payload: { loading_todo: true } });
        dispatch({ type: CHANGE_SEARCH_TODO, payload: { search_todo: '' } });
        api_get_todos(caregory_id, p)
            .then((data) => {
                if (data) {
                    dispatch({ type: CHANGE_LIST_TODO, payload: { todos: data } });
                }
                dispatch({ type: CHANGE_LOADING_TODO, payload: { loading_todo: false } });
            })
            .catch(() => {
                toast.error('Xảy ra lỗi trong quá trình load danh sách tác vụ!', {});
                dispatch({ type: CHANGE_LOADING_TODO, payload: { loading_todo: false } });
            });
    };

    // mở modal thêm
    handle_show_create_modal = () => {
        const { is_show_create_modal } = this.state;
        this.setState({ is_show_create_modal: !is_show_create_modal });
    };

    // mở modal chỉnh sửa
    handle_show_edit_modal = (category_id = null) => {
        const { is_show_edit_modal } = this.state;
        this.setState({
            is_show_edit_modal: !is_show_edit_modal,
            category_choose_id: category_id,
        });
    };

    componentDidMount() {
        this.get_categories();
    }

    get_categories = () => {
        const { dispatch } = this.props;
        api_get_category_todo().then((data) => {
            if (data) {
                dispatch({ type: CHANGE_LIST_CATEGORY, payload: data });
            }
        });
    };

    handle_delete_todo_category = () => {
        const { category_choose_id } = this.state;
        const { history, categories_todo, dispatch } = this.props;

        dispatch({ type: CHANGE_LIST_CATEGORY, payload: categories_todo.filter((category) => category._id !== category_choose_id) });
        this.change_show_list_todo('task', 'Công việc hôm nay');
        this.handle_show_modal_confirm_delete();
        history.push('/app/task');

        api_delete_category_todo(category_choose_id).then((res) => {
            if (!res) {
                toast.error('Đã có lỗi xảy ra, xin vui lòng thử lại!', {});
            }
        });
    };

    categories_render = () => {
        const { menuActiveTodo, categories_todo } = this.props;
        if (categories_todo.length > 0) {
            return categories_todo.map((category, index) => (
                <ListTodoItem
                    handle_show_modal_confirm_delete={this.handle_show_modal_confirm_delete}
                    handle_show_edit_modal={this.handle_show_edit_modal}
                    menuActiveTodo={menuActiveTodo}
                    get_categories={this.get_categories}
                    category={category}
                    // eslint-disable-next-line no-underscore-dangle
                    key={category._id}
                    change_show_list_todo={this.change_show_list_todo}
                />
            ));
        }
        return null;
    };

    render() {
        const {
            is_show_create_modal,
            is_show_edit_modal,
            category_choose_id,
            is_show_modal_confirm_delete,
            loading,
        } = this.state;
        const { menuActiveTodo, categories_todo, is_show_nav_left } = this.props;

        return (
            <>
                <div className={is_show_nav_left ? 'work_list' : 'work_list hide'}>
                    <Nav className="flex-column">
                        <Nav.Item onClick={() => this.change_show_list_todo('task', 'Công việc hôm nay')}>
                            <Link to="/app/task" className={menuActiveTodo === 'task' ? 'nav-link active' : 'nav-link'}>
                                <i className="work-all" /> Hôm nay
                                {/* <span className="_app_work_count">{categories_todo[0] ? categories_todo[0].amount_todo : 0}</span> */}
                            </Link>
                        </Nav.Item>
                        <Nav.Item onClick={() => this.change_show_list_todo('important', 'Công việc quan trọng')}>
                            <Link
                                to="/app/important"
                                className={menuActiveTodo === 'important' ? 'nav-link active' : 'nav-link'}
                            >
                                <i className="fal fa-star" /> Quan trọng
                                {/* <span className="_app_work_count">{categories_todo[2] ? categories_todo[2].amount_todo : 0}</span> */}
                            </Link>
                        </Nav.Item>
                    </Nav>
                    <div className="work_add_list" onClick={this.handle_show_create_modal}>
                        <i className="work-add-list" /> Thêm danh sách
                    </div>
                    <Nav className="_work_tabx flex-column nav">
                        <Spin spin={loading}>{this.categories_render()}</Spin>
                    </Nav>
                </div>
                <Suspense fallback={<div className="d-none">Loading...</div>}>
                    <ModalCreateCategory
                        change_show_list_todo={this.change_show_list_todo}
                        is_show_modal_category={is_show_create_modal}
                        handle_show_modal_category={this.handle_show_create_modal}
                        get_categories={this.get_categories}
                    />
                </Suspense>
                <Suspense fallback={<div className="d-none">Loading...</div>}>
                    <ModalEditCategory
                        is_show_modal_category={is_show_edit_modal}
                        handle_show_modal_category={this.handle_show_edit_modal}
                        get_categories={this.get_categories}
                        category_choose_id={category_choose_id}
                    />
                </Suspense>

                {/* MODAL XÁC NHẬN XÓA TODO */}
                <Modal
                    size="sm"
                    show={is_show_modal_confirm_delete}
                    onHide={this.handle_show_modal_confirm_delete}
                    backdrop="static"
                >
                    <Modal.Body>Bạn có chắc chắn muốn xóa</Modal.Body>
                    <Modal.Footer style={{ padding: '0.4rem' }}>
                        <Button variant="secondary margin-right-8" size="sm" onClick={this.handle_show_modal_confirm_delete}>
                            Hủy
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => this.handle_delete_todo_category()}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = ({ persist, state }) => ({
    profile: persist.profile,
    todos: state.todos,
    categories_todo: state.categories_todo,
    loading_todo: state.loading_todo,
    sort: state.sort,
    search: state.search,
    is_show_nav_left: state.is_show_nav_left,
});

export default withRouter(connect(mapStateToProps)(ListTodo));
