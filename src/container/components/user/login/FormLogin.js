import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { waterfall } from 'async';
import AuthService from '../../../core/auth/AuthService';
import toast from 'react-hot-toast';
import { connect } from 'react-redux';
import { Spinner } from 'react-bootstrap';
// import { LOADING_FULLSCREEN } from '../../../reducers/actions'

const auth = new AuthService();

class FormLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: {
                email: 'donv@gmail.com',
                password: '12345678',
                repeat_password: '',
                remember: false,
            },
            option: 1,
            loading: false,
        };
    }

    setLoading = (value) => {
        this.setState({ loading: value });
    };

    onChangeInput(type, e) {
        const { value } = e.target;
        const { inputs } = this.state;
        inputs[type] = value;
        this.setState({ inputs: { ...inputs } }); // setState input, set rieng 1 inputs
    }

    setOption = (value) => {
        this.setState({
            option: value,
            inputs: {
                email: '',
                password: '',
                repeat_password: '',
                remember: false,
            },
        });
    };

    onSubmit = (e) => {
        const { inputs, option } = this.state;
        const { email, password, repeat_password } = inputs;
        const { history } = this.props;
        this.setLoading(true);
        if (option === 1) {
            waterfall(
                [
                    (callback) => {
                        auth.login({ email, password }).then((data) => {
                            if (data) {
                                callback(null, data);
                            } else {
                                toast.error('Tên tài khoản hoặc mật khẩu không chính xác!');
                                this.setState({ inputs: { ...inputs, password: '' }, loading: false });
                            }
                        });
                    },
                    (data, callback) => {
                        auth.setToken(data.token, () => {
                            callback(null, data);
                        });
                    },
                ],
                () => {
                    this.setLoading(false);
                    history.push('/app');
                }
            );
        } else if (option === 2) {
            if (password.length < 8) {
                toast.dismiss();
                toast.error('Mật khẩu cần tối thiểu 8 kí tự.');
            } else {
                if (password === repeat_password) {
                    auth.register({ email, password }).then((res) => {
                        if (res) {
                            toast.dismiss();
                            toast.success('Đã tạo tài khoản thành công. Hãy đăng nhập để tiếp tục.');
                        } else {
                            toast.dismiss();
                            toast.error('Email này đã được đăng ký rồi.');
                        }
                        this.setOption(1);
                    });
                } else {
                    toast.dismiss();
                    toast.error('Mật khẩu không trùng khớp.');
                }
            }
        } else {
        }
        e.preventDefault();
    };

    // componentDidMount() {
    //     alert('Bạn có thể đăng ký hoặc dùng tài khoản sẵn có. Load lại trang sẽ làm mới thông tin đăng nhập');
    // }

    render() {
        const { inputs, option, loading } = this.state;

        return (
            <div className="root_login">
                <div className="app_login">
                    <div className="container">
                        <header>
                            <div className={'header-headings ' + (option === 1 ? 'sign-in' : option === 2 ? 'sign-up' : 'forgot')}>
                                <span>Đăng nhập</span>
                                <span>Đăng ký</span>
                                <span>Quên mật khẩu</span>
                            </div>
                        </header>
                        <ul className="options">
                            <li className={option === 1 ? 'active' : ''} onClick={() => this.setOption(1)}>
                                Đăng nhập
                            </li>
                            <li className={option === 2 ? 'active' : ''} onClick={() => this.setOption(2)}>
                                Đăng ký
                            </li>
                            <li className={option === 3 ? 'active' : ''} onClick={() => this.setOption(3)}>
                                Quên mật khẩu
                            </li>
                        </ul>
                        <form className="account-form" onSubmit={this.onSubmit}>
                            <div className={'account-form-fields ' + (option === 1 ? 'sign-in' : option === 2 ? 'sign-up' : 'forgot')}>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="E-mail"
                                    required
                                    value={inputs.email}
                                    onChange={(e) => this.onChangeInput('email', e)}
                                    ref={(email) => {
                                        this.email = email;
                                    }}
                                />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Mật khẩu"
                                    required={option === 1 || option === 2 ? true : false}
                                    disabled={option === 3 ? true : false}
                                    value={inputs.password}
                                    onChange={(e) => this.onChangeInput('password', e)}
                                    ref={(password) => {
                                        this.password = password;
                                    }}
                                />
                                <input
                                    id="repeat-password"
                                    name="repeat-password"
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    required={option === 2 ? true : false}
                                    disabled={option === 1 || option === 3 ? true : false}
                                    value={inputs.repeat_password}
                                    onChange={(e) => this.onChangeInput('repeat_password', e)}
                                />
                            </div>
                            <button disabled={loading} className="btn-submit-form" type="submit">
                                {loading ? <Spinner animation="border" variant="light" /> : option === 1 ? 'Đăng nhập' : option === 2 ? 'Đăng ký' : 'Quên mật khẩu'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ persist, state }) => ({});

export default withRouter(connect(mapStateToProps)(FormLogin));
