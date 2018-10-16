

const AWS = require('aws-sdk');

const getClient = () => {
  let options = {};
  // connect to local DB if running offline
  if (process.env.IS_OFFLINE) {
    options = {
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    };
  }
  return new AWS.DynamoDB.DocumentClient(options);
};

/**
 * Utility function to invoke an individual DynamoDB query
 * Extracted into a function to remove duplicated code.
 */
const invokeQuery = params => new Promise(((resolve, reject) => {
  const { DYNAMODB_TABLE } = process.env;
  // eslint-disable-next-line no-param-reassign
  params.TableName = DYNAMODB_TABLE;
  getClient().query(params, (error, result) => {
    if (error) {
      return reject(Error(error));
    }
    return resolve(result);
  });
}));

/**
 * Utility function to write item to Dynamo
 */
const put = item => new Promise(((resolve, reject) => {
  const { DYNAMODB_TABLE } = process.env;
  const params = {
    TableName: DYNAMODB_TABLE,
    Item: item,
  };
  getClient().put(params, (error) => {
    if (error) {
      return reject(Error(error));
    }
    return resolve();
  });
}));

/**
 * Invoke a DynamoDB query that is aware of potentially multiple pages
 * or results. DynamoDB will return a max of 1M of data. If the query
 * results in more than 1M then multiple queries must be sent, each
 * fetching a separate page of results. This function does the work
 * to combine multiple pages of results.
 * @param {*} params
 */
const pageAwareQuery = async (params) => {
  let results = [];
  let morePages = true;

  // The do/while loop below enables retrieving multiple pages of Dynamo results
  // See: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.Pagination
  do {
    // Disable the ESLint rule of no await in loop as this is one of the
    // exception cases where its okay as the loop iterations are not independent.
    // eslint-disable-next-line no-await-in-loop
    const queryResult = await invokeQuery(params);
    results = results.concat(queryResult.Items);
    if (queryResult.LastEvaluatedKey) {
      // there is another page of results
      // eslint-disable-next-line no-param-reassign
      params.ExclusiveStartKey = queryResult.LastEvaluatedKey;
    } else {
      morePages = false;
    }
  }
  while (morePages);

  return results;
};


module.exports = {
  put,
  pageAwareQuery,
  getClient,
};
