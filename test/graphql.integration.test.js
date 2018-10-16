const TestUtils = require('./integrationTestUtils');

/**
 * Reset local DynamnoDB data between each test
 */
beforeEach(async (done) => {
  await TestUtils.resetTestData();
  done();
});

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

    const result = await TestUtils.invokeGraphqlQuery(query);
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

    const result = await TestUtils.invokeGraphqlQuery(mutation);
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

    const sellerQueryResult = await TestUtils.invokeGraphqlQuery(query);
    const fetchedSeller = sellerQueryResult.body.data.seller;
    expect(createdSeller).toEqual(fetchedSeller);
  });
});

describe('GraphQL Backend integration tests', () => {
  test('Register Backend', async () => {
    const mutation = `mutation {
      registerBackend(name: "Bongo Prod", url: "https://bongo.youseeu.com", region: "us-east-1"){
        id
        name
        region
        url
      }
    }`;

    const result = await TestUtils.invokeGraphqlQuery(mutation);
    expect(result.body.errors).toBeUndefined();
    expect(result.statusCode).toEqual(200);
    const registeredBackend = result.body.data.registerBackend;

    // get all backends and verfy the new one is the only one
    const query = `{
      backends{
        id
        name
        url
        region
      }
    }`;

    const allBackendsResult = await TestUtils.invokeGraphqlQuery(query);
    expect(allBackendsResult.body.data.backends.length).toEqual(1);
    const fetchedBackend = allBackendsResult.body.data.backends[0];
    expect(fetchedBackend).toEqual(registeredBackend);
  });
});
