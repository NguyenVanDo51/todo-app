import React, { Component, Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import toast from 'react-hot-toast';
import { api_get_todos, api_delete_todo, api_get_category_todo } from '../../../api';
import { Spin } from '../../common/library';
import {
    CHANGE_LIST_TODO,
    CHANGE_LIST_CATEGORY,
    CHANGE_SEARCH_TODO,
    CHANGE_LOADING_TODO,
    CHANGE_SORT_BY,
    CHANGE_AMOUNT_TODO_COMPLETED,
} from '../../../reducers/actions';

const ListTask = React.lazy(() => import('./ListTask'));
const ModalCreateTodo = React.lazy(() => import('./ModalCreateTodo'));

class TodoLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todo: {
                remind: {
                    date: '',
                    time: '',
                },
            }, // Lưu thông tin input đang được chọn
            is_show_sort: false,
            is_show_modal_create_todo: false,
        };
        this.ref_sort = React.createRef();
    }

    set_loading = (is_load) => {
        // this.setState({ loading: is_load });
        const { dispatch } = this.props;
        dispatch({ type: CHANGE_LOADING_TODO, payload: { loading_todo: is_load } });
    };

    setShowModalCreateTodo = (value) => {
        this.setState({ is_show_modal_create_todo: value });
    };

    // Lấy danh sách category todo
    get_categories = () => {
        const { profile, dispatch } = this.props;
        // this.set_loading(true);
        api_get_category_todo({
            uid: profile.uid,
        })
            .then((data) => {
                console.log('data', data);
                dispatch({ type: CHANGE_LIST_CATEGORY, payload: data });
                dispatch({ type: CHANGE_AMOUNT_TODO_COMPLETED, payload: data[0].amount_all || 0 });
                // this.set_loading(false);
            })
            .catch(() => {
                toast.error('Đã có lỗi xảy ra trong quá trình load danh sách tác vụ!', {});
            });
    };

    //Xử lý tìm kiếm todo
    handleSearchTodo = (e) => {
        const { value } = e.target;
        const { dispatch } = this.props;
        // eslint-disable-next-line react/destructuring-assignment
        const kw = this.props.search_todo;
        if (value === '' && kw) {
            this.getTodo(null, null, false, false);
            dispatch({ type: CHANGE_SEARCH_TODO, payload: { search_todo: value } });
        } else if (value) {
            dispatch({ type: CHANGE_SEARCH_TODO, payload: { search_todo: value } });
        }
        if (e.keyCode === 13) {
            this.getTodo({ search: kw });
        }
    };

    // Get Todo
    getTodo = (params = null, todo_t = null, is_load = true, is_search_value = true) => {
        const { loading } = this.state;
        if (loading) return;
        const { category, dispatch, search_todo } = this.props;
        const p = {
            ...params,
        };
        if (is_search_value) p.search = search_todo;
        if (is_load) this.set_loading(true);
        api_get_todos(category || 'task', p).then((data) => {
            if (data) {
                if (todo_t !== null) {
                    this.setState({ todo: todo_t });
                }
                dispatch({ type: CHANGE_LIST_TODO, payload: { todos: data } });
                // this.get_categories();
            }
            this.set_loading(false);
        });
    };

    handle_sort = (s = null, r = 'asc') => {
        const { sort, dispatch, todos } = this.props;
        if (sort.sort_by && sort.sort_by === s) {
            this.set_show_sort(false);
            return;
        };
        if (s === null) {
            if (r && sort.reverse !== r) {
                dispatch({ type: CHANGE_LIST_TODO, payload: { todos: [...todos].reverse() } });
                dispatch({ type: CHANGE_SORT_BY, payload: { sort: { ...sort, reverse: r } } });
                return;
            }
        }
        const sort_t = { ...sort };
        sort_t.sort_by = s || '';
        sort_t.reverse = r || '';
        // if (s === null && r === null) {
            // this.getTodo();
        // } else {
            this.getTodo(sort_t);
        // }
        this.set_show_sort(false);
        dispatch({ type: CHANGE_SORT_BY, payload: { sort: sort_t } });
    };

    componentDidMount() {
        // const { dispatch, category } = this.props;
        // let title = '';
        // switch (category) {
        //     case 'task':
        //         title = 'Tất cả công việc';
        //         break;
        //     case 'completed':
        //         title = 'Công việc đã hoàn thành';
        //         break;
        //     default:
        //         // api_get_one_category_todo(category).then((data) => {
        //         //     if (data) {
        //         //         dispatch({ type: CHANGE_LIST_TODO_NAME, payload: { todo_category_name: data.name } });
        //         //     }
        //         // });
        //         break;
        // }
        // dispatch({ type: CHANGE_LIST_TODO_NAME, payload: { todo_category_name: title } });
        this.getTodo();
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        const { dispatch } = this.props;
        dispatch({ type: CHANGE_LIST_TODO, payload: { todos: [] } });
    }

    handleClickOutside = (event) => {
        if (this.ref_sort && this.ref_sort.current && !this.ref_sort.current.contains(event.target)) {
            this.set_show_sort(false);
        }
    };

    // Xóa todo
    handleDeleteTodo = (index) => {
        const { todos, showModalConfirm } = this.state;
        const todos_t = [...todos];
        if (showModalConfirm) {
            this.setState({ showModalConfirm: false });
        }
        api_delete_todo({ id: todos_t[index].id })
            .then(() => {
                todos_t.splice(index, 1);
                // this.setState({ todos: todos_t });
                this.getTodo();
            })
            .catch(() => {
                toast.error('Có lỗi xảy ra, vui lòng thử lại!', {});
            });
    };

    // Xử lý onchange của các ô input khi show 1 input
    handleChangeTodo = (e, type = '') => {
        const { todo } = this.state;
        const todo_t = { ...todo };
        const { value } = e.target;
        todo_t[type] = value;
        this.setState({ todo: todo_t });
    };

    render_sort_option = () => {
        const { sort } = this.props;
        if (sort.sort_by) {
            let sort_type = '';
            switch (sort.sort_by) {
                case 'is_important':
                    sort_type = 'việc quan trọng';
                    break;
                case 'time_out':
                    sort_type = 'ngày đến hạn';
                    break;
                case 'title':
                    sort_type = 'bảng chữ cái';
                    break;
                case 'created_at':
                    sort_type = 'ngày tạo';
                    break;
                default:
                    break;
            }
            const sort_reverse = sort.reverse === 'asc' ? 'desc' : 'asc';
            return (
                <div className="work_sort_info" style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                    <i
                        onClick={() => this.handle_sort(null, sort_reverse)}
                        className={sort_reverse === 'desc' ? 'fa fa-chevron-down' : 'fa fa-chevron-up'}
                        style={{ fontSize: '13px', cursor: 'pointer' }}
                    />
                    <span style={{ margin: '0 6px', lineHeight: '19px' }}>Đang sắp xếp theo {sort_type}</span>
                    <i
                        className="fa fa-times"
                        aria-hidden="true"
                        onClick={() => {
                            this.set_show_sort(false);
                            this.handle_sort(null, null);
                        }}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            );
        }
        return null;
    };

    set_show_sort = (value = false) => {
        this.setState({ is_show_sort: value });
    };

    render() {
        const { is_show_sort, is_show_modal_create_todo } = this.state;
        const { todo_category_name, search_todo, category, todos, loading_todo, sort, loading_fullscreen } = this.props;
        return (
            <>
                <div className="work_content">
                    <Spin spin={!loading_fullscreen && loading_todo}>
                        <div className="container">
                            <div className="work_all_content">
                                <div className="container">
                                    <div className="work_all_content_title">
                                        <h2>{todo_category_name || 'Danh sách công việc'}</h2>
                                    </div>
                                    <div className="work_toolbar">
                                        {/* PHAN TIM KIEM */}
                                        <div className="work_content_search">
                                            <div className="work_content_search_input">
                                                <input
                                                    type="search"
                                                    name="search"
                                                    placeholder="Tìm kiếm công việc"
                                                    value={search_todo}
                                                    onChange={this.handleSearchTodo}
                                                    onKeyUp={this.handleSearchTodo}
                                                />
                                            </div>
                                            <div className="work_content_search_btn">
                                                <i className="icon-search" />
                                            </div>
                                        </div>
                                        <div className="work_toolbar_right">
                                            {category && category !== 'task' && category !== 'important' && (
                                                <div className="work_add_button mx-1" onClick={() => this.setShowModalCreateTodo(true)}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                                        <g fill="none" fillRule="evenodd" transform="translate(4 3)">
                                                            <mask id="jd4FBg" fill="#fff">
                                                                <path d="M9 8h7a.5.5 0 1 1 0 1H9v7a.5.5 0 1 1-1 0V9H1a.5.5 0 0 1 0-1h7V1a.5.5 0 0 1 1 0v7z"></path>
                                                            </mask>
                                                            <g mask="url(#jd4FBg)">
                                                                <path fill="currentColor" d="M-4-3h24v24H-4z"></path>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                    <span className="work_sort_span">Thêm</span>
                                                </div>
                                            )}

                                            {/* PHAN SAP XEP */}
                                            <div className="work_sort">
                                                <div className="work_sort_btn" onClick={() => this.set_show_sort(true)}>
                                                    <i className="fas fa-sort-alt" />
                                                    <span className="work_sort_span">Sắp xếp</span>
                                                </div>

                                                {is_show_sort ? (
                                                    <div className="work_sort_content active" ref={this.ref_sort}>
                                                        <div className="work_sort_fitter">
                                                            <div
                                                                className={
                                                                    sort.sort_by === 'is_important' ? 'work_sort_fitter_item active' : 'work_sort_fitter_item'
                                                                }
                                                                onClick={() => this.handle_sort('is_important', 'asc')}
                                                            >
                                                                <i className="far fa-star" /> Việc quan trọng
                                                            </div>
                                                            <div
                                                                className={sort.sort_by === 'time_out' ? 'work_sort_fitter_item active' : 'work_sort_fitter_item'}
                                                                onClick={() => this.handle_sort('time_out', 'asc')}
                                                            >
                                                                <i className="far fa-calendar-minus" /> Ngày đến hạn
                                                            </div>
                                                            <div
                                                                className={sort.sort_by === 'title' ? 'work_sort_fitter_item active' : 'work_sort_fitter_item'}
                                                                onClick={() => this.handle_sort('title', 'asc')}
                                                            >
                                                                <i className="far fa-sort-alpha-down-alt" /> Bảng chữ cái
                                                            </div>
                                                            <div
                                                                className={sort.sort_by === 'created_at' ? 'work_sort_fitter_item active' : 'work_sort_fitter_item'}
                                                                onClick={() => this.handle_sort('created_at', 'asc')}
                                                            >
                                                                <i className="far fa-calendar-plus" /> Ngày tạo
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    {this.render_sort_option()}
                                </div>
                            </div>
                            {/* PHAN CONG VIEC CHINH */}
                            <Suspense fallback={<div className="d-none">Loading...</div>}>
                                <ListTask todos={todos} getTodo={this.getTodo} category={category} get_categories={this.get_categories} />
                            </Suspense>
                            {/* PHAN FOOTER */}
                            <Suspense fallback={null}>
                                <ModalCreateTodo
                                    is_show_modal={is_show_modal_create_todo}
                                    handle_show_modal_create_todo={this.setShowModalCreateTodo}
                                    todos={todos}
                                    category_id={category}
                                />
                            </Suspense>
                        </div>
                    </Spin>
                </div>
            </>
        );
    }
}

const mapStateToProps = ({ persist, state }) => ({
    profile: persist.profile,
    todos: state.todos,
    todo_category_name: state.todo_category_name,
    loading_todo: state.loading_todo,
    sort: state.sort,
    search_todo: state.search_todo,
    loading_fullscreen: state.loading_fullscreen,
});

export default withRouter(connect(mapStateToProps)(TodoLayout));
