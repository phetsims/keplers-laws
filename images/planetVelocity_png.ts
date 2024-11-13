/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;