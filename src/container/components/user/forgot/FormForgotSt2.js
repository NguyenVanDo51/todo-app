import React, { Component } from 'react';
import waterfall from 'async/waterfall';
import { Button, Input, tclass } from '../../common/library';

export default class FormForgotSt2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            codeVal: props.codeVal,
            form_st2: {
                code: {
                    value: '',
                    validate: true,
                    msg: null,
                },
                new_password: {
                    value: '',
                    validate: true,
                    msg: null,
                },
                cf_new_password: {
                    value: '',
                    validate: true,
                    msg: null,
                },
            },
        };
    }


    onChangeInput(type, e) {
        const { value } = e.target;
        const { form_st2 } = this.state;
        form_st2[type].value = value;
        form_st2[type].validate = true;
        this.setState({ form_st2 });
    }

    onSubmit = () => {
        const self = this;
        const { form_st2, codeVal } = this.state;
        const { onSubmitSt2 } = this.props;

        waterfall([
            (callback) => {
                if (form_st2.new_password.value.length >= 8) {
                    form_st2.new_password.validate = true;
                } else {
                    form_st2.new_password.validate = false;
                    form_st2.new_password.msg = 'Mật khẩu lớn hơn 8 kí tự';
                }
                self.setState({ form_st2 }, () => {
                    if (form_st2.new_password.validate) callback(null, 'next');
                });
            },
            (next, callback) => {
                if (form_st2.cf_new_password.value === form_st2.new_password.value) {
                    form_st2.cf_new_password.validate = true;
                } else {
                    form_st2.cf_new_password.validate = false;
                    form_st2.cf_new_password.msg = 'Xác nhận mật khẩu không trùng khớp';
                }
                self.setState({ form_st2 }, () => {
                    if (form_st2.cf_new_password.validate) callback(null, 'next');
                });
            },

        ], () => {
            self.setState({ loading: true });
            const parmas = {
                code: codeVal,
                password: form_st2.new_password.value,
                cf_password: form_st2.cf_new_password.value,
            };
            onSubmitSt2(parmas, () => {
                self.setState({ loading: false });
            });
        });
    }

    render() {
        const { loading, form_st2 } = this.state;
        return (
            <React.Fragment>
                <div className={tclass('form_login')}>
                    <div className="title_form text-center color-white"><h2>Xác nhận mật khẩu mới</h2></div>
                    <div className={tclass('form_login_content')}>
                        <form>
                            <Input
                                onChange={(e) => this.onChangeInput('new_password', e)}
                                className={tclass('form-control')}
                                type="password"
                                placeholder="Mật khẩu mới"
                                ic_tooltip="Mật khẩu mới"
                                ic_left="icons8-password"
                                error={form_st2.new_password.validate === false ? form_st2.new_password.msg : ''}
                                value={form_st2.new_password.value}
                                autoComplete="new_password"
                                label="Mật khẩu mới"
                            />
                            <Input
                                onChange={(e) => this.onChangeInput('cf_new_password', e)}
                                className={tclass('form-control')}
                                type="password"
                                placeholder="Xác nhận mật khẩu mới"
                                ic_tooltip="Xác nhận mật khẩu mới"
                                ic_left="icons8-password"
                                error={form_st2.cf_new_password.validate === false ? form_st2.cf_new_password.msg : ''}
                                value={form_st2.cf_new_password.value}
                                autoComplete="cf_new_password"
                                label="Xác nhận mật khẩu mới"
                            />

                        </form>
                        <div className={tclass('form_btn')}>
                            <Button
                                className={tclass('btn btn-primary')}
                                loading={loading}
                                onClick={this.onSubmit}
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
