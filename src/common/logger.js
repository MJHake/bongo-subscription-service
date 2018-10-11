

/**
 * This determines if log output is written to the console. Note that
 * by default log output is suppressed during test. This is because there
 * are a log of negative tests that log error messages, as expected, and
 * all of this error logging makes it look like tests have problems.
 * So this keeps the test output uncluttered.
 *
 * However, during development you may have a need to see log output
 * during test, for example if you have a failing test. In this case
 * simply set the environment var FORCE_LOG=true
 */
const shouldLog = () => process.env.NODE_ENV !== 'test' || process.env.FORCE_LOG === 'true';

/**
 * Log debug messages
 * @param {*} args
 */
const debug = (...args) => {
  if (shouldLog()) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

/**
 * Log error messages
 * @param {*} args
 */
const error = (...args) => {
  if (shouldLog()) {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
};

module.exports = {
  debug,
  error,
};
