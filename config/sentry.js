const Sentry = require('@sentry/node');

Sentry.init({ dsn: process.env.SENTRY_TRACKING_URL });

module.exports = Sentry;
