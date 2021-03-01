/* eslint-disable eol-last */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';

class FormRestPass extends Component {
    render() {
        return (
          <>
            <div className="v2_bota_setting_reset_pass">
                <div className="container">
                    <h1>ĐỔI MẬT KHẨU</h1>
                    <div className="v2_bota_setting_reset_pass_form">
                    <form action="restpass.html">
                        <div className="row">
                        <div className="col-xl-5 col-lg-5 col-sm-5 col-5">
                            <label>Mật khẩu cũ:</label>
                        </div>
                        <div className="col-xl-7 col-lg-7 col-sm-7 col-7">
                            <input type="password" name="password" id="password" />
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-xl-5 col-lg-5 col-sm-5 col-5">
                            <label>Mật khẩu mới:</label>
                        </div>
                        <div className="col-xl-7 col-lg-7 col-sm-7 col-7">
                            <input
                            type="password"
                            name="confirm_password"
                            id="confirm_password"
                            // onKeyUp="check()"
                            />
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-xl-5 col-lg-5 col-sm-5 col-5">
                            <label>Xác nhận mật khẩu mới:</label>
                        </div>
                        <div className="col-xl-7 col-lg-7 col-sm-7 col-7">
                            <input
                            type="password"
                            name="confirm_password_new"
                            id="confirm_password_new"
                            // onKeyUp="check()"
                            />
                            <span className="password_error" id="password_error" />
                        </div>
                        </div>
                        <div className="v2_bota_setting_reset_pass_form_btn">
                        <span
                            className="v2_bota_setting_reset_pass_error"
                            id="v2_bota_setting_reset_pass_error"
                        >
                            Mật khẩu cũ chưa chính xác!
                        </span>
                        <button className="reset">Hủy</button>
                        <button
                            className="submit"
                            // onKeyUp="check_pass()"
                        >
                            Lưu
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
          </>
        );
    }
}

export default FormRestPass;