/**
 * This file encapsulates all the knowledge of how the data model
 * is represented in DynamoDB.
 */

const uuidv4 = require('uuid/v4');
const {
  put,
  pageAwareQuery,
} = require('./dynamoClient');

const getAllSellers = async () => {
  const params = {
    KeyConditionExpression: 'dataType = :type',
    ExpressionAttributeValues: {
      ':type': 'Seller',
    },
  };

  const result = await pageAwareQuery(params);
  return result;
};

const getSeller = async (sellerId) => {
  const params = {
    KeyConditionExpression: 'dataType = :type and id = :sid',
    ExpressionAttributeValues: {
      ':type': 'Seller',
      ':sid': sellerId,
    },
  };

  const result = await pageAwareQuery(params);
  return result;
};

const getSellerAccessCodes = async (sellerId) => {
  const params = {
    KeyConditionExpression: 'dataType = :type',
    FilterExpression: 'sellerId = :sid',
    ExpressionAttributeValues: {
      ':type': 'AccessCode',
      ':sid': sellerId,
    },
  };

  const result = await pageAwareQuery(params);
  return result;
};

/**
 * Insert a new seller, with unique ID into DB
 */
const createSeller = async (name, email) => {
  const id = uuidv4();
  const data = {
    id,
    dataType: 'Seller',
    name,
    email,
  };

  await put(data);
  return data;
};

module.exports = {
  createSeller,
  getSeller,
  getAllSellers,
  getSellerAccessCodes,
};
