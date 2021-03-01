/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FormForgotSt1 from '../../../container/components/user/forgot/FormForgot';
import { user_api } from '../../../container/services/api/fetch';
import toast from 'react-hot-toast';
import { first_array } from '../../../container/helpers';

class FormForgot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // step: 1,
            // codeVal: false,
        };
    }

    componentDidMount() {
        const { location } = this.props;

        const regex = /\?code=([a-zA-Z0-9]+)$/i;
        const str = location.search;
        const m = regex.exec(str);

        if (m !== null) {
            m.forEach((codeVal, groupIndex) => {
                if (groupIndex === 1) {
                    this.setState({
                        // step: 2,
                        // codeVal,
                    });
                }
            });
        }
    }

    onSubmitSt1 = (params, cb) => {
        user_api({ ...params, mtype: 'forgot_req' }).then((data) => {
            if (data.errors !== undefined) {
                toast.error('Đã xảy ra lỗi!', {
                });
            } else if (data.status === false) {
                toast.error('Đã xảy ra lỗi!', {
                });
            } else {
                toast.success('Thành công!', {
                });
            }
            if (cb) cb();
        });
    }

    onSubmitSt2 = (params, cb) => {
        const { history } = this.props;
        user_api({ ...params, mtype: 'forgot_reset' }).then((data) => {
            if (data.errors !== undefined) {
                toast.error('Đã có lỗi xảy ra!', {
                });
            } else {
                toast.success('Thành công!', {
                });
                history.push('/login');
            }
            if (cb) cb();
        });
    }

    render() {
        // const { step, codeVal } = this.state;
        return (
            <>
                <FormForgotSt1 {...this.props} onSubmitSt1={this.onSubmitSt1} />
            </>
        );
    }
}

const mapStateToProps = () => ({

});
export default withRouter(connect(mapStateToProps)(FormForgot));
