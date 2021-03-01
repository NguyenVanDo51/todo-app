import * as Types from '../actions';
const initialState = {
    show_confirm_logout: false,
    is_show_nav_left: true,
    show_list_todo: '',
    todo_category_name: 'Danh sách công việc',
    /**---------------LIST TODO---------------*/
    todos: [],
    sort: {
        sort_by: '',
        reverse: '',
    },
    search_todo: '',
    amount_todo_not_complete: 0,

    /**---------------LIST CATEGORY---------------*/
    categories_todo: [],
    loading_todo: false,
    /**---------------END---------------*/
};

const routerReducers = (state = initialState, { type, payload } = {}) => {
    let states = state;
    switch (type) {
        case Types.SHOW_CONFIRM_LOGOUT_MODAL:
            states = { ...state, show_confirm_logout: payload.show_confirm_logout };
            break;

        case Types.SHOW_CONTENT_TODOS:
            states = { ...state, show_list_todo: payload.show_list_todo };
            break;

        case Types.CHANGE_LIST_TODO:
            states = { ...state, todos: payload.todos };
            break;

        case Types.CHANGE_LIST_TODO_NAME:
            states = { ...state, todo_category_name: payload.todo_category_name };
            break;

        case Types.CHANGE_LIST_CATEGORY:
            states = { ...state, categories_todo: payload };
            break;

        case Types.CHANGE_SORT_BY:
            states = { ...state, sort: payload.sort };
            break;

        case Types.CHANGE_SEARCH_TODO:
            states = { ...state, search_todo: payload.search_todo };
            break;

        case Types.CHANGE_AMOUNT_TODO_COMPLETED:
            states = { ...state, amount_todo_not_complete: payload };
            break;

        case Types.CHANGE_LOADING_TODO:
            states = { ...state, loading_todo: payload.loading_todo };
            break;

        case Types.CHANGE_SHOW_NAV_LEFT:
            states = { ...state, is_show_nav_left: payload };
            break;

        default:
            states = state;
            break;
    }
    return states;
};

export default routerReducers;
