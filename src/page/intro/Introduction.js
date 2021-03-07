/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
// import { Link } from 'react-router';
// import feature from '../../style/scss/imgs/feature.png';
import left_img from '../../style/scss/imgs/welcome-left.png';
import right_img from '../../style/scss/imgs/welcome-right.png';
import center_img from '../../style/scss/imgs/welcome-center.png';
import logo from '../../style/scss/imgs/logo_login.png';

class Introduction extends React.Component {
    render() {
        return (
            <>
                <section className="container intro">
                    <div className="row intro_container">
                        <div className="col-lg-4 d-none d-lg-flex height-100-vh img_container">
                            <img className="intro_img left img_fluid" src={left_img} alt="left welcome" />
                        </div>
                        <div className="col-12 col-lg-4 main_part">
                            <div className="center">
                                <img src={logo} alt="logo" className="intro_logo" />
                                <h3 className="header_title">D. Todo List</h3>
                                <p className="header_content">Đem đến cho bạn trải nghiệm thú vị và tuyệt vời trong công việc.</p>
                                <img className="intro_img left img_fluid d-lg-none" src={center_img} alt="center welcome" />
                                <a role="button" href="/login" className="btn_start">
                                    Bắt đầu
                                </a>
                                <a href="#" alt="more_info">
                                    Tìm hiểu thêm
                                </a>
                                <div className="download_container">
                                    <p>Tải xuống D.Todo</p>
                                    <div className="icon_container d-flex">
                                        <a href="#" className="iconLink" aria-label="Tải xuống  for Android" title="Tải xuống  for Android" rel="noreferrer">
                                            <i className="icon svgIcon ms-Icon android">
                                                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24">
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M7 17V9h12.016c0 .103-.011.202-.016.303V17c0 1.104-.896 2-2 2v2.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V19h-2v2.5c0 .828-.672 1.5-1.5 1.5S9 22.328 9 21.5V19c-1.104 0-2-.896-2-2zm-4-5.5c0-.829.672-1.5 1.5-1.5s1.5.671 1.5 1.5V16c0 .828-.672 1.5-1.5 1.5S3 16.828 3 16v-4.5zm17 0c0-.829.672-1.5 1.5-1.5s1.5.671 1.5 1.5V16c0 .828-.672 1.5-1.5 1.5S20 16.828 20 16v-4.5zM19 8H7c0-1.412.491-2.708 1.308-3.733L7.074 2.262c-.144-.235-.071-.543.164-.688.232-.144.541-.072.688.164l1.095 1.78C10.08 2.576 11.472 2 13 2s2.92.576 3.979 1.518l1.095-1.78c.146-.236.455-.308.688-.164.235.145.308.453.164.688l-1.234 2.005C18.509 5.292 19 6.588 19 8zm-7.75-2.375c0-.345-.28-.625-.625-.625S10 5.28 10 5.625s.28.625.625.625.625-.28.625-.625zm4.75 0C16 5.28 15.72 5 15.375 5s-.625.28-.625.625.28.625.625.625.625-.28.625-.625z"
                                                    ></path>
                                                </svg>
                                            </i>
                                        </a>
                                        <a href="#" className="iconLink" aria-label="Tải xuống  for Windows" title="Tải xuống  for Windows" rel="noreferrer">
                                            <i className="icon svgIcon ms-Icon windows">
                                                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24">
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M3 4.9999l9-1.35v7.85H3v-6.5zm19.9998-2.9997v9.499h-10v-8l10-1.499zm-9.9999 10.4994h10v9.5l-10-1.5v-8zm-9.9999 0h9v7.85l-9-1.349v-6.501z"
                                                    ></path>
                                                </svg>
                                            </i>
                                        </a>
                                        <a href="#" className="iconLink" aria-label="Tải xuống  for iOS" title="Tải xuống  for iOS" rel="noreferrer">
                                            <i className="icon svgIcon ms-Icon ios">
                                                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24">
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M16.949 6.074c2.952 0 4.113 2.101 4.113 2.101s-2.271 1.161-2.271 3.979c0 3.178 2.829 4.273 2.829 4.273s-1.978 5.566-4.649 5.566c-1.227 0-2.181-.826-3.473-.826-1.318 0-2.625.858-3.477.858-2.439 0-5.521-5.281-5.521-9.525 0-4.177 2.608-6.367 5.055-6.367 1.591 0 2.825.917 3.652.917.71 0 2.027-.976 3.742-.976zm.295-5.049s.285 1.71-1.085 3.357c-1.464 1.758-3.128 1.47-3.128 1.47s-.312-1.383.915-3c1.38-1.819 3.298-1.827 3.298-1.827z"
                                                    ></path>
                                                </svg>
                                            </i>
                                        </a>
                                    </div>
                                </div>
                                <p className="text-muted">Điều khoản sử dụng</p>
                            </div>
                        </div>
                        <div className="col-lg-4 d-none d-lg-flex height-100-vh img_container">
                            <img className="intro_img left img_fluid" src={right_img} alt="left welcome" />
                        </div>
                    </div>
                </section>
            </>
        );
    }
}

export default Introduction;
