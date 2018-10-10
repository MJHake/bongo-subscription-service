const {
  successResponse,
  errorResponse,
  apiGatewaySuccessResponseJson,
  apiGatewayErrorResponseJson,
  apiGatewaySuccessResponseCSV,
} = require('./responseBuilder');

describe('successResponse', () => {
  test('includes correct data', () => {
    const response = successResponse({ a: 1 });
    expect(response).toEqual({ data: { a: 1 } });
  });
});

describe('errorResponse', () => {
  test('includes correct body', () => {
    const response = errorResponse(500, 'foo');
    expect(response).toEqual({ error: { code: 500, message: 'foo' } });
  });
});

describe('apiGatewaySuccessResponseJson', () => {
  test('includes correct headers', () => {
    const response = apiGatewaySuccessResponseJson({ a: 1 });
    expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(response.headers['Access-Control-Allow-Credentials']).toBe(true);
  });

  test('includes correct status code', () => {
    const response = apiGatewaySuccessResponseJson({ a: 1 });
    expect(response.statusCode).toBe(200);
  });

  test('includes correct body', () => {
    const response = apiGatewaySuccessResponseJson({ a: 1 });
    expect(response.body).toBe(JSON.stringify({ data: { a: 1 } }));
  });
});

describe('apiGatewayErrorResponseJson', () => {
  test('includes correct headers', () => {
    const response = apiGatewayErrorResponseJson(500, ['foo']);
    expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(response.headers['Access-Control-Allow-Credentials']).toBe(true);
  });

  test('includes correct status code', () => {
    const response = apiGatewayErrorResponseJson(500, ['foo']);
    expect(response.statusCode).toBe(500);
  });

  test('includes correct body', () => {
    const response = apiGatewayErrorResponseJson(500, ['foo']);
    expect(response.body).toBe(JSON.stringify({ errors: ['foo'] }));
  });
});

describe('successResponseCSV', () => {
  test('includes correct headers', () => {
    const response = apiGatewaySuccessResponseCSV('a,b,c');
    expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(response.headers['Access-Control-Allow-Credentials']).toBe(true);
    expect(response.headers['Content-Disposition']).toBe('attachment; filename=export.csv');
    expect(response.headers['Content-Type']).toBe('text/csv');
  });

  test('includes correct status code', () => {
    const response = apiGatewaySuccessResponseCSV('a,b,c');
    expect(response.statusCode).toBe(200);
  });
});
