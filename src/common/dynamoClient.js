

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

module.exports = { getClient, getAll };
