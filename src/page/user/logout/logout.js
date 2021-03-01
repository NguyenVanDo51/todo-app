import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class LogOut extends PureComponent {
    render() {
        return (
            <>
                <div className="container_login_bg" />
                <div className="container_login">
                    logout
                </div>
            </>
        );
    }
}

// function LogOut() {
//     return (
//         <React.Fragment>
//             <div className="container_login_bg" />
//             <div className="container_login">
//                 logout
//             </div>
//         </React.Fragment>
//     );
// }

const mapStateToProps = () => ({

});

export default withRouter(connect(mapStateToProps)(LogOut));
