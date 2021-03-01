import { POST, GET, PUT, DELETE} from '../core/network';

export async function user_login_api(params) {
    return await POST('/api/v1/users/login', params);
}

export async function user_register_api(params) {
    return await POST('/api/v1/users/register', params);
}

export async function api_get_profile(params) {
    return await GET('/api/v1/users/get', params);
}

export async function user_logout_api(params) {
    return await POST('/api/v1/users/logout', params);
}

export async function validation_api(params) {
    const result = await POST('/common/validation', params);
    return result;
}

/*------------- USER EDIT -------------- */
export async function user_api(params) {
    // return result;
}

export async function api_update_profile(params) {
    const result = await POST('/api/v1/profile/edit', params);
    return result;
}

export async function api_profile_get_by_id(params) {
    const result = await POST('/api/v1/profile/get-by-id', params);
    return result;
}

// export async function api_profile_send_email(params) {
//     const result = await POST_WITH_FORM_DATA('/api/v1/profile/sendmail', params);
//     return result;
// }

export async function api_get_profile_by_derpartment_ids(params) {
    const result = await POST('/api/v1/profile/get-by-department-ids', params);
    return result;
}

export async function api_get_profile_filter(params) {
    return await POST('/api/v1/profile/filter', params);
}
/*------------- USER EDIT -------------- */


/*------------- TODO -------------- */
export async function api_create_todo(params) {
    const result = await POST('/api/v1/todos', params);
    return result;
}

export async function api_get_todos(category_id, params = null) {
    const result = await GET(`/api/v1/categories/${category_id}/todos`, params);
    return result;
}

export async function api_get_one_todo(params = null) {
    // const result = await GET('/api/v1/todo/get', params);
    // return result;
}

export async function api_update_todo(todo_id, params) {
    return await PUT(`/api/v1/todos/${todo_id}`, params);
}

export async function api_delete_todo(todo_id) {
    return await DELETE(`/api/v1/todos/${todo_id}`);
}

/*------------- TODO CATEGORY -------------- */
export async function api_create_category_todo(params) {
    const result = await POST('/api/v1/categories', params);
    return result;
}

export async function api_edit_category_todo(category_id, params) {
    return await PUT(`/api/v1/categories/${category_id}`, params);
}

export async function api_delete_category_todo(category_id) {
    const result = await DELETE(`/api/v1/categories/${category_id}`);
    return result;
}

export async function api_get_category_todo(params) {
    const result = await GET('/api/v1/categories', params);
    return result;
}

export async function api_get_one_category_todo(category_id, params = null) {
    return await GET(`/api/v1/categories/${category_id}`, params);
}

export async function api_get_all_todo_in_category(category_id, params){
    // const result = await GET('/api/v1/')
}

/*------------- TODO -------------- */