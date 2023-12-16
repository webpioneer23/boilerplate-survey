import PropTypes from 'prop-types';
import isMobile from 'ismobilejs';

const DesktopOnly = ({ children }: { children: JSX.Element }) => {

    if (!isMobile().any) {
        return children;
    }

    return null;
}

DesktopOnly.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DesktopOnly;
