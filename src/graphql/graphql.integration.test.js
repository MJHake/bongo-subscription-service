const request = require('supertest');
const fs = require('fs');
const { dynamoClear, dynamoBatchWrite } = require('../common/integrationTestUtils');

beforeEach(async (done) => {
  process.env.IS_OFFLINE = true;
  process.env.DYNAMODB_TABLE = 'bongo-subscription-service-dev';
  await dynamoClear();

  // read test data to load
  const fileContents = fs.readFileSync('test-data/sampleData1.json');
  const itemsArray = JSON.parse(fileContents);
  await dynamoBatchWrite(itemsArray);
  done();
});

describe('GraphQL Seller integration tests', () => {
  test('Get Sellers', (done) => {
    const myRequest = request('http://localhost:3000');

    const query = `{
      sellers{
        id
        name
        email
        accessCodes{
          id
          code
          seller{
            name
          }
        }
      }
    }`;

    const body = JSON.stringify({ query });

    myRequest.post('/graphql')
      .send(body)
      .set('Content-Type', 'application/json')
      .end((error, result) => {
        // console.log('integration test error:', error);
        // console.log('integration test status code', result.statusCode);
        // console.log('graphql test body:', JSON.stringify(result.body));

        expect(result.statusCode).toEqual(200);
        done();
      });
  });
});
