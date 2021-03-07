import React from 'react';
import { Spinner } from 'react-bootstrap';
import logo from '../../style/scss/imgs/logo_login.png';

class LoadingFullscreen extends React.PureComponent {
    render() {
        return(
            <div className="fullscreen_loading">
                <img src={logo} alt="logo" />
                <Spinner animation="border" variant="info" />
                <p>Đang tải dữ liệu</p>
            </div>
        )
    }
}

export default LoadingFullscreen;