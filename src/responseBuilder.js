

const successResponse = data => ({
  data,
});

const errorResponse = (code, message) => ({
  error: {
    code,
    message,
  },
});

const headers = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
};

const csvHeaders = {
  ...headers,
  'Content-Disposition': 'attachment; filename=export.csv',
  'Content-Type': 'text/csv',
};

/**
 * API Gateway format
 */
const apiGatewaySuccessResponseJson = data => ({
  statusCode: 200,
  headers,
  body: JSON.stringify({ data }),
});

/**
 * API Gateway format
 */
const apiGatewayErrorResponseJson = (statusCode, errors) => ({
  statusCode,
  headers,
  body: JSON.stringify({ errors }),
});

/**
 * API Gateway format
 */
const apiGatewaySuccessResponseCSV = csv => ({
  statusCode: 200,
  headers: csvHeaders,
  body: csv,
});

module.exports = {
  successResponse,
  errorResponse,
  apiGatewaySuccessResponseJson,
  apiGatewayErrorResponseJson,
  apiGatewaySuccessResponseCSV,
};
