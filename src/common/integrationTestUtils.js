const { getClient, getAll } = require('./dynamoClient');

const batchDelete = (tableName, items) => {
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

  return new Promise((resolve, reject) => {
    getClient().batchWrite(params, (error) => {
      if (error) {
        return reject(Error(error));
      }
      console.log('Batch delete success');
      return resolve();
    });
  });
};

const dynamoBatchWrite = (items) => {
  const { DYNAMODB_TABLE } = process.env;
  console.log('BatchWrite:', items);
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

  return new Promise((resolve, reject) => {
    getClient().batchWrite(params, (error) => {
      if (error) {
        console.error('Batch write error:', error);
        return reject(Error(error));
      }
      console.log('Batch write success');
      return resolve();
    });
  });
};

const dynamoClear = async () => {
  console.log('Clear DynamoDB invoked.');
  const { DYNAMODB_TABLE } = process.env;
  const items = await getAll(DYNAMODB_TABLE);
  if (!items || items.length === 0) {
    console.log('DynamoDB table is already empty.');
  } else {
    console.log('Deleting all items in DynamoDB table.');
    await batchDelete(DYNAMODB_TABLE, items);
  }
};

module.exports = { dynamoClear, dynamoBatchWrite };
