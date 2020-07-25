const Sentry = require('@sentry/node');

Sentry.init({
  dsn:
    'https://0492253760514bab9e816a1a300e19ff@o422409.ingest.sentry.io/5348436',
});

module.exports = Sentry;
