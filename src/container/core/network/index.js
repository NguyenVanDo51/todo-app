import qs from 'qs';
import axios from 'axios';
import toast from 'react-hot-toast';
import { isEmpty } from 'lodash';
import localforage from 'localforage';
import { URL_API } from '../config';

// function serialize(obj) {
//     return `?${Object.keys(obj)
//         .reduce((a, k) => {
//             if (obj[k]) a.push(`${k}=${encodeURIComponent(obj[k])}`);
//             return a;
//         }, [])
//         .join('&')}`;
// }

async function getToken() {
    return localforage.getItem('todo_token');
}

export async function GET(url, params) {
    const token = await getToken();
    try {
        const res = await axios(URL_API + url, {
            method: 'get',
            responseType: 'json',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: params,
            params,
        });
        if (res.data !== undefined) {
            return res.data;
        }
    } catch (error) {
        try {
            if (!isEmpty(error) && (error.response.status === 403 || error.response.status === 401)) {
                console.log('Bạn chưa đăng nhập hoặc phiên đãng nhập đã hết hạn!', {});
                localforage.removeItem('todo_token');
            }
            if (!isEmpty(error) && error.response.status === 500) {
                toast.error('Đã có lỗi trong quá trình xử lí !', {});
            }
        } catch (e) {
            toast.error('Đã xảy ra lỗi!', {});
        }
    }
}

export async function POST(url, params) {
    const token = await getToken();
    const params_s = { ...params };
    try {
        const res = await axios(URL_API + url, {
            method: 'post',
            responseType: 'json',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: params_s,
        });
        if (res.data !== undefined) {
            return res.data;
        }
    } catch (error) {
        try {
            if (!isEmpty(error) && (error.response.status === 403 || error.response.status === 401)) {
                // toast.error('Bạn chưa đăng nhập hoặc phiên đãng nhập đã hết hạn!', {});
                console.log('Bạn chưa đăng nhập hoặc phiên đãng nhập đã hết hạn!', {});
                localforage.removeItem('todo_token');
            }
            if (!isEmpty(error) && error.response.status === 500) {
                toast.error('Đã có lỗi trong quá trình xử lí !', {});
            }
        } catch (e) {
            toast.error('Đã xảy ra lỗi!', {});
        }
    }
}

export async function POST_DOWNLOAD(url, params) {
    const token = await getToken();
    try {
        const res = await axios(URL_API + url, {
            method: 'post',
            responseType: 'blob',
            headers: {
                authcode: token,
            },
            data: qs.stringify(params),
        });
        if (res.data !== undefined) {
            return res.data;
        }
    } catch (error) {
        try {
            if (!isEmpty(error) && error.response.status === 403) {
                console.log('Bạn chưa đăng nhập hoặc phiên đãng nhập đã hết hạn!', {});
                window.location.href = '/login';
            }
        } catch (e) {
            toast.error('Đã có lỗi xảy ra!', {});
        }
    }
}

export async function PUT(url, params) {
    const token = await getToken();
    const params_s = { ...params };
    try {
        const res = await axios(URL_API + url, {
            method: 'put',
            responseType: 'json',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: params_s,
        });
        if (res.data) {
            return res.data;
        }
    } catch (error) {
        if (error.response.status === 403) {
            toast.error('Phiên đăng nhập đã hết hạn', {});
            // window.location.href = '/login';
        } else {
            toast.error('Đã có lỗi xảy ra!', {});
        }
    }
}

export async function DELETE(url) {
    const token = await getToken();
    try {
        const res = await axios(URL_API + url, {
            method: 'delete',
            responseType: 'json',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.data) {
            return res.data;
        }
    } catch (error) {
        if (error.response.status === 403) {
            toast.error('Phiên đăng nhập đã hết hạn', {});
            // window.location.href = '/login';
        } else {
            toast.error('Đã có lỗi xảy ra!', {});
        }
    }
}

export async function POST_LOGIN_ID(url, params) {
    try {
        const res = await axios(URL_API + url, {
            method: 'post',
            responseType: 'json',
            data: qs.stringify(params),
        });
        return res.data;
    } catch (error) {
        try {
            // if (!isEmpty(error) && error.response.status === 403) {
            //     notification('error', 'Lỗi xác thực', `${error.message} - tài khoản bạn hết hạn đăng nhập hoặc đã có ai đó đang sử dụng tài khoản này!`);
            //     window.location.href = '/login';
            // }
        } catch (e) {
            toast.error('Đã có lỗi xảy ra!', {});
        }
    }
}

export async function POST_NO_AUTH(url, params) {
    try {
        const res = await axios(URL_API + url, {
            method: 'post',
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
            },
            data: { ...params },
        });
        if (res.data !== undefined) {
            return res.data;
        }
    } catch (error) {
        try {
            if (!isEmpty(error) && error.response.status === 403) {
                toast.error('Phiên đăng nhập đã hết hạn', {});
            }
        } catch (e) {
            toast.error('Đã có lỗi xảy ra!', {});
        }
    }
}

export async function POST_LOGOUT(url, params) {
    const token = await getToken();
    const params_s = { ...params };
    try {
        if (params_s.token === undefined || isEmpty(params_s.token)) {
            params_s.token = token;
        }
        const res = await axios(URL_API + url, {
            method: 'post',
            responseType: 'json',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: params_s,
        });
        if (res.data !== undefined) {
            return res.data;
        }
    } catch (error) {
        try {
            if (error.response.status === 401) {
                return { status: 200 };
            }
        } catch (e) {
            toast.error('Đã có lỗi xảy ra!', {});
        }
    }
}
