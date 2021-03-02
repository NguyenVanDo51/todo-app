import React from 'react';
// import { Link } from 'react-router';
// import feature from '../../style/scss/imgs/feature.png';

class Introduction extends React.Component {
    render() {
        return (
            <>
                <div className="intro">
                    <header className="header">
                        <h3 className="header_title">Ứng dụng todo</h3>
                        <p className="header_content">Quản lý, phân loại công việc. Đem đến cho bạn trải nghiệm thú vị và tuyệt vời.</p>
                    </header>
                    <div className="start">
                        <button>Bắt đầu</button>
                    </div>
                    <div className="img_app">
                        {/* <img src="" /> */}
                    </div>
                </div>
            </>
        );
    }
}

export default Introduction;
