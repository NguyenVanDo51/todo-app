/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Spin } from '../../common/library';

class ModalIntroduceSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    render() {
        const { loading } = this.state;
        const { show, onHide } = this.props;
        return (
            <Modal show={show} onHide={onHide} centered>
                <Spin spin={loading}>
                    <h3>Do Something.....</h3>
                </Spin>
            </Modal>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    profile: persist.profile,
});

export default withRouter(connect(mapStateToProps)(ModalIntroduceSetting));
