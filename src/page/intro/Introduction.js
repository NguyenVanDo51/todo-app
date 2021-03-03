import React from 'react';
import { useHistory } from 'react-router-dom';
// import { Link } from 'react-router';
// import feature from '../../style/scss/imgs/feature.png';
import left_img from '../../style/scss/imgs/welcome-left.png';
import right_img from '../../style/scss/imgs/welcome-right.png';
import logo from '../../style/scss/imgs/logo_login.png';

class Introduction extends React.Component {
    render() {
        return (
            <>
                <div className="intro">
                    <section className="container">
                        <div className="row">
                            {/* <div className="col-12 intro_container"> */}
                            <div className="col-3">
                                <img className="intro_img left" src={left_img} alt="left welcome" />
                            </div>
                            <div className="col-3">
                                <div className="center">
                                    <img src={logo} alt="logo" className="intro_logo mb-3" />
                                    <h3 className="header_title mb-3">D. Todo List</h3>
                                    <p className="header_content mb-3">Quản lý, phân loại công việc. Đem đến cho bạn trải nghiệm thú vị và tuyệt vời.</p>
                                    <a role="button" href="/login" className="btn_start">
                                        Bắt đầu
                                    </a>
                                </div>
                            </div>
                            <div className="col-3">
                                <img className="intro_img left" src={right_img} alt="left welcome" />
                            </div>
                            {/* </div> */}
                        </div>
                    </section>
                </div>
            </>
        );
    }
}

export default Introduction;
