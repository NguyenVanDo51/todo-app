import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import tclass from './tclass';

class Spin extends PureComponent {
    render() {
        const { children, txt, spin } = this.props;
        return (
            <div className={tclass('spin')}>
                {children}
                <div className={tclass('overlay', {
                    hide: spin !== true,
                })}
                >
                    <div className={tclass('overlay_icon')}>
                        <div className={tclass('loader')} />
                        <div className={tclass('txt')}>{txt}</div>
                    </div>
                </div>
            </div>
        );
    }
}

Spin.defaultProps = {
    spin: false,
    txt: 'Vui lòng đợi giây lát...',
};

Spin.propTypes = {
    spin: PropTypes.bool,
    txt: PropTypes.string,
};

export default Spin;
