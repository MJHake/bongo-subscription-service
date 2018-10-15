

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

const getAllSellers = () => {
  const { DYNAMODB_TABLE } = process.env;
  const params = {
    TableName: DYNAMODB_TABLE,
    KeyConditionExpression: 'dataType = :type',
    ExpressionAttributeValues: {
      ':type': 'Seller',
    },
  };

  return new Promise((resolve, reject) => {
    getClient().query(params, (error, result) => {
      if (error) {
        return reject(Error(error));
      }
      return resolve(result.Items);
    });
  });
};

const getSeller = (sellerId) => {
  const { DYNAMODB_TABLE } = process.env;
  const params = {
    TableName: DYNAMODB_TABLE,
    KeyConditionExpression: 'dataType = :type and id = :sid',
    ExpressionAttributeValues: {
      ':type': 'Seller',
      ':sid': sellerId,
    },
  };

  return new Promise((resolve, reject) => {
    getClient().query(params, (error, result) => {
      if (error) {
        return reject(Error(error));
      }
      return resolve(result.Items);
    });
  });
};

const getSellerAccessCodes = (sellerId) => {
  const { DYNAMODB_TABLE } = process.env;
  const params = {
    TableName: DYNAMODB_TABLE,
    KeyConditionExpression: 'dataType = :type',
    FilterExpression: 'sellerId = :sid',
    ExpressionAttributeValues: {
      ':type': 'AccessCode',
      ':sid': sellerId,
    },
  };

  return new Promise((resolve, reject) => {
    getClient().query(params, (error, result) => {
      if (error) {
        return reject(Error(error));
      }
      return resolve(result.Items);
    });
  });
};


// TODO - remove this
const getAll = (tableName) => {
  const params = {
    TableName: tableName,
  };

  return new Promise((resolve, reject) => {
    getClient().scan(params, (error, result) => {
      if (error) {
        return reject(Error(error));
      }
      return resolve(result.Items);
    });
  });
};

module.exports = {
  getClient,
  getAll,
  getAllSellers,
  getSellerAccessCodes,
  getSeller,
};
