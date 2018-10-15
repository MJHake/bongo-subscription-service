const { getClient, getAll } = require('../src/common/dynamoClient');


const dynamoBatchWrite = params => new Promise((resolve, reject) => {
  getClient().batchWrite(params, (error) => {
    if (error) {
      console.error('Dynamo batch write error:', error);
      return reject(Error(error));
    }
    return resolve();
  });
});

const deleteItemsFromDynamo = (tableName, items) => {
  if (!items || items.length === 0) {
    // no action necessary
    return Promise.resolve();
  }

  const deleteRequests = items.map(item => ({
    DeleteRequest: {
      Key: {
        dataType: item.dataType,
        id: item.id,
      },
    },
  }));

  const params = {
    RequestItems: {
    },
  };

  params.RequestItems[tableName] = deleteRequests;
  return dynamoBatchWrite(params);
};

/**
 * Helper utility to populate DynamoDB data during local integration
 * tests with a local DynamoDB
 * @param {*} items
 */
const putDynamoData = (items) => {
  // console.log(`PutDynamoData invoked to write ${items.length} items.`);
  const { DYNAMODB_TABLE } = process.env;
  if (!items || items.length === 0) {
    // no action necessary
    return Promise.resolve();
  }

  const putRequests = items.map(item => ({
    PutRequest: {
      Item: item,
    },
  }));

  const params = {
    RequestItems: {
    },
  };

  params.RequestItems[DYNAMODB_TABLE] = putRequests;
  return dynamoBatchWrite(params);
};

/**
 * Helper utility to clear DynamoDB data during local integration
 * tests with a local DynamoDB
 */
const clearDynamoData = async () => {
  const { DYNAMODB_TABLE } = process.env;
  const items = await getAll(DYNAMODB_TABLE);
  if (!items || items.length === 0) {
    // console.log('DynamoDB table is already empty.');
  } else {
    // console.log('Deleting all items in DynamoDB table.');
    await deleteItemsFromDynamo(DYNAMODB_TABLE, items);
  }
};

module.exports = { clearDynamoData, putDynamoData };
