/* eslint-disable import/order */
/* eslint-disable eol-last */
/* eslint-disable semi */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import FormRestPass from '../../../container/components/user/restpass/FormRestPass';
import { withRouter } from 'react-router-dom';

class RestPass extends Component {
    render() {
        return (
            <>
                <FormRestPass />
            </>
        );
    }
}

export default withRouter(RestPass);