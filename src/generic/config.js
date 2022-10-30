const _ = require('lodash');

const appEnv = process.env.APP_ENV || process.env.NODE_ENV || 'development';
if (!appEnv) {
    throw new Error('No APP_ENV or NODE_ENV environment variable set');
}

module.exports = _.merge(require('../../config/default'), require(`../../config/${appEnv}`));
