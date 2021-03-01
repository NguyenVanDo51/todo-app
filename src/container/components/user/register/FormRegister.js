/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { clone } from 'lodash';
import waterfall from 'async/waterfall';
import { validation_api } from '../../../services/api/fetch';
import { validateEmail } from '../../../helpers/Validate';
import { Button, Input, tclass, Link, Spin } from '../../common/library';

export default class FormRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            register: {
                full_name: { value: '', validate: true, msg: null },
                email: { value: '', validate: true, msg: null },
                phone: { value: '', validate: true, msg: null },
                password: { value: '', validate: true, msg: null },
                cf_password: { value: '', validate: true, msg: null },
            },
        };
    }

    onChangeInput(type, e) {
        const { value } = e.target;
        const { register } = this.state;
        const inputs_obj = { ...register };
        inputs_obj[type].value = value;
        this.setState({ register: inputs_obj });
    }

    onSubmit = () => {
        const self = this;
        const { register } = this.state;
        const { dispatch } = this.props;
        const inputs_obj = { ...register };
        self.setState({ loading: true });
        waterfall([
            (callback) => {
                if (inputs_obj.full_name.value.length > 0) {
                    inputs_obj.full_name.validate = true;
                } else {
                    inputs_obj.full_name.validate = false;
                    inputs_obj.full_name.msg = 'Tên không được để trống';
                }
                self.setState({ register: inputs_obj });
                if (inputs_obj.full_name.validate) {
                    callback(null, 'next');
                } else {
                    self.setState({ loading: false });
                }
            },
            (next, callback) => {
                if (inputs_obj.email.value.length > 0) {
                    inputs_obj.email.validate = true;
                } else {
                    inputs_obj.email.validate = false;
                    inputs_obj.email.msg = 'Email không được để trống';
                }
                self.setState({ register: inputs_obj });
                if (inputs_obj.email.validate) {
                    callback(null, 'next');
                } else {
                    self.setState({ loading: false });
                }
            },
            (next, callback) => {
                if (inputs_obj.phone.value.length >= 10 && inputs_obj.phone.value.length <= 11) {
                    validation_api({ mtype: 'number_phone', number_phone: inputs_obj.phone.value }).then((data) => {
                        if (data.errors !== undefined) {
                            inputs_obj.phone.validate = false;
                            inputs_obj.phone.msg = data.errors.message;
                        } else if (data.validate) {
                            inputs_obj.phone.validate = true;
                        } else {
                            inputs_obj.phone.validate = false;
                            inputs_obj.phone.msg = 'Số điện thoại Không xác định được.';
                        }
                        self.setState({ register: inputs_obj });
                        if (inputs_obj.phone.validate) {
                            callback(null, 'next');
                        } else {
                            self.setState({ loading: false });
                        }
                    });
                } else {
                    inputs_obj.phone.validate = false;
                    inputs_obj.phone.msg = 'Số điện thoại không đúng định dạng.';
                    self.setState({ register: inputs_obj, loading: false });
                }
            },
            (next, callback) => {
                if (inputs_obj.password.value.length > 0) {
                    inputs_obj.password.validate = true;
                } else {
                    inputs_obj.password.validate = false;
                    inputs_obj.password.msg = 'Mật khẩu không được để trống';
                }
                self.setState({ register: inputs_obj });
                if (inputs_obj.password.validate) {
                    callback(null, 'next');
                } else {
                    self.setState({ loading: false });
                }
            },
            (next, callback) => {
                if (inputs_obj.cf_password.value.length > 0) {
                    inputs_obj.cf_password.validate = true;
                } else {
                    inputs_obj.cf_password.validate = false;
                    inputs_obj.cf_password.msg = 'Mật khẩu không được để trống';
                }
                self.setState({ register: inputs_obj });
                if (inputs_obj.cf_password.validate) {
                    callback(null, 'next');
                } else {
                    self.setState({ loading: false });
                }
            },
        ], (err, result) => {
                if (result) self.props.register(register, () => { self.setState({ loading: false }); });
        });
    }

    render() {
        const { loading, register } = this.state;
        return (
            <>
                <Spin spin={loading}>
                    <content>
                        <div className="v2_bota_registration">
                            <div className="container">
                                <div className="v2_bota_registration_content">
                                    <div className="v2_bota_registration_logo">
                                        <a href="/" title="logo">
                                            <img src="/image/logo.png" alt="logo" />
                                        </a>
                                    </div>
                                    <h1>Đăng ký tài khoản</h1>
                                    <div className="v2_bota_registration_form">
                                        <form action="login.html">
                                            <div className="v2_bota_registration_form_group">
                                                <Input
                                                    onChange={(e) => this.onChangeInput('full_name', e)}
                                                    className={tclass('input', {
                                                        error: register.full_name.validate === false && register.full_name.msg !== null,
                                                    })}
                                                    type="text"
                                                    placeholder="Tên đầy đủ"
                                                    error={register.full_name.validate === false ? register.full_name.msg : ''}
                                                    value={register.full_name.value}
                                                />
                                            </div>
                                            <div className="v2_bota_registration_form_group">
                                                <Input
                                                    onChange={(e) => this.onChangeInput('email', e)}
                                                    className={tclass('input', {
                                                        error: register.email.validate === false && register.email.msg !== null,
                                                    })}
                                                    type="text"
                                                    placeholder="Email"
                                                    error={register.email.validate === false ? register.email.msg : ''}
                                                    value={register.email.value}
                                                />
                                            </div>
                                            <div className="v2_bota_registration_form_group">
                                                <Input
                                                    onChange={(e) => this.onChangeInput('phone', e)}
                                                    className={tclass('input', {
                                                        error: register.phone.validate === false && register.phone.msg !== null,
                                                    })}
                                                    type="number"
                                                    placeholder="Số điện thoại"
                                                    error={register.phone.validate === false ? register.phone.msg : ''}
                                                    value={register.phone.value}
                                                />
                                            </div>
                                            <div className="v2_bota_registration_form_group">
                                                <Input
                                                    onChange={(e) => this.onChangeInput('password', e)}
                                                    className={tclass('input', {
                                                        error: register.password.validate === false && register.password.msg !== null,
                                                    })}
                                                    type="password"
                                                    placeholder="Mật khẩu"
                                                    error={register.password.validate === false ? register.password.msg : ''}
                                                    value={register.password.value}
                                                />
                                                <i className="fa btn-showpassword fa-eye-slash" onClick="showPassword(this)" />
                                            </div>
                                            <div className="v2_bota_registration_form_group">
                                                <Input
                                                    onChange={(e) => this.onChangeInput('cf_password', e)}
                                                    className={tclass('input', {
                                                        error: register.cf_password.validate === false && register.cf_password.msg !== null,
                                                    })}
                                                    type="password"
                                                    placeholder="Nhập lại mật khẩu"
                                                    error={register.cf_password.validate === false ? register.cf_password.msg : ''}
                                                    value={register.cf_password.value}
                                                />
                                            </div>
                                            <div className="v2_bota_registration_form_full">
                                                <div className="v2_bota_registration_remember">
                                                    <label className="checkcontainerx">
                                                        <input type="checkbox" />
                                                        <span className="checkmarkx" />Đồng ý với
                                                        <a href="/" title="Điều khoản của Id.webbnc.vn"> Điều khoản của Id.webbnc.vn </a>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="v2_bota_registration_form_btn">
                                                {/* <button type="button">Đăng ký</button> */}
                                                <Button type="button" loading={loading} onClick={this.onSubmit}>Tiếp tục</Button>
                                            </div>
                                            <div className="v2_bota_registration_form_link">
                                                Đã có tài khoản <a href="/login" title="Đăng nhập ngay">Đăng nhập ngay</a>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </content>
                </Spin>
                {/* <div className={tclass('form_login')}>
                    <div className={tclass('title_form text-center color-white')}><h2>Tạo tài khoản</h2></div>
                    <div className={tclass('form_login_content')}>
                        <div className={tclass('logo hidden')}>
                            <img src="image/logo.svg" alt="BNC Project" />
                        </div>
                        <form>
                            <Input
                                onChange={(e) => this.onChangeInput('email', e)}
                                className={tclass('form-control', {
                                    error: register.email.validate === false && register.email.msg !== null,
                                })}
                                autoComplete="email"
                                type="text"
                                placeholder="demo@bncgroup.com.vn"
                                ic_tooltip="Địa chỉ email phải chính xác và chưa được sử dụng trên hệ thống."
                                ic_left="icons8-email-envelope"
                                error={register.email.validate === false ? register.email.msg : ''}
                                value={register.email.value}
                                label="Email"
                            />
                            <Input
                                onChange={(e) => this.onChangeInput('phone', e)}
                                className={tclass('form-control', {
                                    error: register.phone.validate === false && register.phone.msg !== null,
                                })}
                                type="text"
                                placeholder="0968888888"
                                ic_tooltip="Số điện thoại quý khách cần phải chính xác."
                                ic_left="icons8-phone"
                                error={register.phone.validate === false ? register.phone.msg : ''}
                                value={register.phone.value}
                                label="Số điện thoại"
                            />
                        </form>
                        <div className={tclass('form_btn')}>
                            <Button className={tclass('btn btn-primary')} loading={loading} onClick={this.onSubmit}>Tiếp tục</Button>
                        </div>
                        <div className={tclass('text-center')}>
                            <div className={tclass('register_link')}>
                                Bạn đã có tài khoản ? <Link to="/login"><span className={tclass('text-danger')}> Đăng nhập </span></Link>
                            </div>
                        </div>
                    </div>
                </div> */}
            </>
        );
    }
}
