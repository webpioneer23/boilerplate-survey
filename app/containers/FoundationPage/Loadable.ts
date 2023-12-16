/**
 * Asynchronously loads the component for FoundationPage
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
