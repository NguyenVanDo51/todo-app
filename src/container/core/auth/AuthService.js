import localforage from 'localforage';
import moment from 'moment';
import { api_get_profile, user_login_api, user_logout_api, user_register_api } from '../../api/index';

moment().utcOffset(7);
export default class AuthService {
    login(params_source) {
        const params = { ...params_source };
        return user_login_api(params).then((data) => {
            return Promise.resolve(data);
        });
    }

    register(params) {
        return user_register_api({...params}).then(data => {
            return Promise.resolve(data);
        })
    }

    async getInfo() {
        return api_get_profile().then((data) => {
            return Promise.resolve(data);
        });
    }

    setToken(idToken, cb) {
        localforage.setItem('todo_token', idToken, () => {
            if (cb) cb(null, idToken);
        });
    }

    async getToken() {
        // Retrieves the user token from localStorage
        return localforage.getItem('todo_token').then((todo_token) => todo_token);
    }

    removeToken(cb){
        localforage.removeItem('todo_token').then(() => {
            if (cb) { cb(null); }
        });
    }

    getTokenCb(cb) {
        localforage.getItem('todo_token').then((todo_token) => {
            if (cb) { cb(null, todo_token); }
        });
    }

    logout() {
        return user_logout_api().then((data) => {
            return Promise.resolve(data);
        });
    }
}
