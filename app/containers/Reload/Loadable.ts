/**
 * Asynchronously loads the component for Reload
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
