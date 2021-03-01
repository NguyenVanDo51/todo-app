import React, { Component } from 'react';
import waterfall from 'async/waterfall';
import { validateEmail } from '../../../helpers/Validate';
// import { Button, Input, tclass, Link } from '../../common/library';
// import { createCaptchaApi } from '../../../services/api/fetch';

export default class FormForgot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // loading: false,
            // image: '',
            form_st1: {
                email: {
                    value: '',
                    validate: true,
                    msg: null,
                },
                node_name: {
                    value: '',
                    validate: true,
                    msg: null,
                },
                captcha: {
                    value: '',
                    validate: true,
                    msg: null,
                },
            },
        };
    }

    componentDidMount() {
        // this.getCaptcha();
    }

    onChangeInput(type, e) {
        const { value } = e.target;
        const { form_st1 } = this.state;
        form_st1[type].value = value;
        form_st1[type].validate = true;
        this.setState({ form_st1 });
    }

    onSubmit = () => {
        const self = this;
        const { form_st1 } = this.state;
        waterfall([
            (callback) => {
                if (form_st1.node_name.value.length !== 0) {
                    form_st1.node_name.validate = true;
                } else {
                    form_st1.node_name.validate = false;
                    form_st1.node_name.msg = 'Tên doanh nghiệp không hợp lệ';
                }
                self.setState({ form_st1 }, () => {
                    if (form_st1.node_name.validate) callback(null, 'next');
                });
            },
            (next, callback) => {
                if (validateEmail(form_st1.email.value)) {
                    form_st1.email.validate = true;
                } else {
                    form_st1.email.validate = false;
                    form_st1.email.msg = 'Địa chỉ email không chính xác.';
                }
                self.setState({ form_st1 }, () => {
                    if (form_st1.email.validate) callback(null, 'next');
                });
            },
            (next, callback) => {
                if (form_st1.captcha.value.length === 4) {
                    form_st1.captcha.validate = true;
                } else {
                    form_st1.captcha.validate = false;
                    form_st1.captcha.msg = 'Mã không hợp lệ';
                }
                self.setState({ form_st1 }, () => {
                    if (form_st1.captcha.validate) callback(null, 'next');
                });
            },

        ], () => {
            self.setState({ loading: true });
            const params = {
                email: form_st1.email.value,
                captcha: form_st1.captcha.value,
                node_name: form_st1.node_name.value,
            };

            self.props.onSubmitSt1(params, () => {
                form_st1.email.value = '';
                form_st1.captcha.value = '';
                form_st1.node_name.value = '';
                self.setState({ loading: false, form_st1 }, () => {
                    self.getCaptcha();
                });
            });
        });
    }

    // getCaptcha() {
    //     createCaptchaApi().then((data) => {
    //         const { image } = data;
    //         this.setState({ image });
    //     });
    // }

    render() {
        // const { loading, image, form_st1 } = this.state;

        return (
            <>
                <content>
                    <div className="v2_bota_login">
                        <div className="container">
                            <div className="v2_bota_login_content">
                                <div className="v2_bota_login_logo">
                                    <a href="/" title="logo">
                                        <img src="/image/logo.png" alt="logo" />
                                    </a>
                                </div>
                                    <h1>Quên mật khẩu</h1>
                                    <div className="v2_bota_login_form">
                                        <form action="setting.html">
                                            <div className="v2_bota_login_form_group">
                                                <input type="text" name="email" placeholder="Email" />
                                            </div>
                                                <div className="v2_bota_login_form_btn">
                                                    <button type="button">Lấy lại password</button>
                                                </div>
                                                <div className="v2_bota_login_form_link">
                                                    Đã có tài khoản <a href="login.html" title="Đăng nhập ngay">Đăng nhập ngay</a>
                                                </div>
                                        </form>
                                    </div>
                            </div>
                        </div>
                    </div>
                </content>
                {/* <div className={tclass('form_login')}>
                    <div className={tclass('title_form text-center color-white')}><h2>Lấy lại mật khẩu</h2></div>
                    <div className={tclass('form_login_content')}>
                        <form>
                            <Input
                                onChange={(e) => this.onChangeInput('node_name', e)}
                                className={tclass('form-control')}
                                type="text"
                                placeholder="bpos888"
                                ic_tooltip="Tên doanh nghiệp cần phải chính xác."
                                ic_left="icons8-user-avatar"
                                error={form_st1.node_name.validate === false ? form_st1.node_name.msg : ''}
                                value={form_st1.node_name.value}
                                label="Tên doanh nghiệp"
                                require
                            />
                            <Input
                                onChange={(e) => this.onChangeInput('email', e)}
                                className={tclass('form-control')}
                                autoComplete="email"
                                type="text"
                                placeholder="demo@bncgroup.com.vn"
                                ic_tooltip="Địa chỉ email phải chính xác và đã đăng ký trên hệ thống."
                                ic_left="icons8-email-envelope"
                                error={form_st1.email.validate === false ? form_st1.email.msg : ''}
                                value={form_st1.email.value}
                                label="Email"
                                require
                            />
                            <div className="check_captcha">
                                <Input
                                    onChange={(e) => this.onChangeInput('captcha', e)}
                                    className={tclass('form-control')}
                                    autoComplete="captcha"
                                    type="text"
                                    placeholder="Mã bảo vệ"
                                    ic_tooltip="Mã bảo vệ"
                                    ic_left="icons8-password"
                                    error={form_st1.captcha.validate === false ? form_st1.captcha.msg : ''}
                                    value={form_st1.captcha.value}
                                    label="Mã bảo vệ"
                                    require
                                />
                                <div className={tclass('margin-top-20')}>
                                    <img src={image} alt="" />
                                </div>
                            </div>
                        </form>
                        <div className={tclass('form_btn')}>
                            <Button
                                className={tclass('btn btn-primary')}
                                loading={loading}
                                onClick={this.onSubmit}
                            >
                                Lấy mật khẩu
                            </Button>
                        </div>

                        <div className={tclass('text-center')}>
                            <div className={tclass('more_link')}>
                                <Link className={tclass('text-danger')} to="/login"><i className="la la-mail-reply la-lg" /> Trở lại đăng nhập.</Link>
                            </div>
                        </div>
                    </div>
                </div> */}
            </>
        );
    }
}
