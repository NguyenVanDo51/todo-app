import * as Types from '../actions';

const initialState = {
    version: 1.0,
    profile: {},
    token: '',
    uid: null,
    form_login: {
        email: '',
    },
};

const routerReducersStatic = (state = initialState, { type, payload } = {}) => {
    let states = { ...state };
    switch (type) {
        case 'R_TOTAL_ONLINE':
            states = { ...state, version: payload };
            break;
        // states = { ...state, version: payload }; break;
        case Types.R_PROFILE:
            states = { ...state, profile: payload, uid: payload.uid };
            break;

        case Types.R_TOKEN:
            states = { ...state, token: payload };
            break;

        case Types.R_FORM_LOGIN:
            states = { ...state, form_login: payload };
            break;
        default:
            states = state;
            break;
    }
    return states;
};

export default routerReducersStatic;
