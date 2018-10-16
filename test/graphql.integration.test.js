const request = require('supertest');
const fs = require('fs');
const { clearDynamoData, putDynamoData } = require('./integrationTestUtils');

const testURL = 'http://localhost:3000';
/**
 * Reset local DynamnoDB data between each test
 */
beforeEach(async (done) => {
  process.env.IS_OFFLINE = true;
  process.env.DYNAMODB_TABLE = 'global-subscription-service-dev';
  await clearDynamoData();

  // read test data to load
  const fileContents = fs.readFileSync('test/test-data/sampleData1.json');
  const itemsArray = JSON.parse(fileContents);
  await putDynamoData(itemsArray);
  done();
});

/**
 * Helper function to invoke GraphQL query or mutation
 */
const invokeGraphqlQuery = query => new Promise(((resolve, reject) => {
  const myRequest = request(testURL);
  myRequest.post('/graphql')
    .send(JSON.stringify({ query }))
    .set('Content-Type', 'application/json')
    .end((error, result) => {
      if (error) {
        reject(Error(error));
      }
      resolve(result);
    });
}));

describe('GraphQL Seller integration tests', () => {
  test('Get Sellers', async () => {
    const query = `{
      sellers{
        id
        name
        email
        accessCodes{
          id
          code
          expireDate
          seller{
            name
          }
        }
      }
    }`;

    const result = await invokeGraphqlQuery(query);
    expect(result.body.errors).toBeUndefined();
    expect(result.statusCode).toEqual(200);
    const { sellers } = result.body.data;
    // console.log(JSON.stringify(sellers));
    expect(sellers.length).toEqual(4);

    const d2lSeller = sellers.find(item => item.name === 'D2L');
    expect(d2lSeller.email).toBe('sales@d2l.com');
    expect(d2lSeller.accessCodes.length).toBe(1);
    expect(d2lSeller.accessCodes[0].code).toBe('D2L-055-444');

    const thSeller = sellers.find(item => item.name === 'TopHat');
    expect(thSeller.email).toBe('sales@tophat.com');
    expect(thSeller.accessCodes.length).toBe(1);
    expect(thSeller.accessCodes[0].code).toBe('TH-007-999');

    const varSeller = sellers.find(item => item.name === 'Moodle Var');
    expect(varSeller.email).toBe('sales@moodle.com');
    expect(varSeller.accessCodes.length).toBe(1);
    expect(varSeller.accessCodes[0].code).toBe('M-999-123');

    const ysuSeller = sellers.find(item => item.name === 'YouSeeU');
    expect(ysuSeller.email).toBe('sales@youseeu.com');
    expect(ysuSeller.accessCodes.length).toBe(1);
    expect(ysuSeller.accessCodes[0].code).toBe('YSU-123-ABC');
  });

  test('Create Seller', async () => {
    const mutation = `mutation {
      createSeller(name: "Moodle Super Seller", email: "sales@mss.com"){
        id
        name
        email
      }
    }`;

    const result = await invokeGraphqlQuery(mutation);
    expect(result.body.errors).toBeUndefined();
    expect(result.statusCode).toEqual(200);
    const createdSeller = result.body.data.createSeller;

    // Query for new seller
    const query = `{
      seller(id: "${createdSeller.id}"){
        id
        name
        email
      }
    }`;

    const sellerQueryResult = await invokeGraphqlQuery(query);
    const fetchedSeller = sellerQueryResult.body.data.seller;
    expect(createdSeller).toEqual(fetchedSeller);
  });
});
