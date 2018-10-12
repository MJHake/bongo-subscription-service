
const request = require('supertest');

describe.skip('integration test', () => {
  test('bla bla', (done) => {
    const myRequest = request('http://localhost:3000');
    myRequest.get('/all').end((error, result) => {
      // console.log('integration test error:', error);
      // console.log('integration test status code', result.statusCode);
      // console.log('integration test body:', result.body);

      expect(result.statusCode).toEqual(200);
      done();
    });
  });
});
