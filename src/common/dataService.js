/**
 * This file encapsulates all the knowledge of how the data model
 * is represented in DynamoDB.
 */

const uuidv4 = require('uuid/v4');
const {
  put,
  pageAwareQuery,
} = require('./dynamoClient');

const dataTypes = {
  SELLER: 'Seller',
  ACCCESS_CODE: 'AccessCode',
  SUBSCRIPTION: 'Subscription',
  BACKEND: 'BongoBackend',
};

const getAllSellers = async () => {
  const params = {
    KeyConditionExpression: 'dataType = :type',
    ExpressionAttributeValues: {
      ':type': dataTypes.SELLER,
    },
  };
  const result = await pageAwareQuery(params);
  return result;
};

const getSeller = async (sellerId) => {
  const params = {
    KeyConditionExpression: 'dataType = :type and id = :sid',
    ExpressionAttributeValues: {
      ':type': dataTypes.SELLER,
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
      ':type': dataTypes.ACCCESS_CODE,
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
    dataType: dataTypes.SELLER,
    name,
    email,
  };

  await put(data);
  return data;
};

/**
 * Insert a new Backend Environment, with unique ID into DB
 */
const createBackend = async (name, region, url) => {
  const id = uuidv4();
  const data = {
    id,
    dataType: dataTypes.BACKEND,
    name,
    region,
    url,
  };
  await put(data);
  return data;
};

const getAllBackends = async () => {
  const params = {
    KeyConditionExpression: 'dataType = :type',
    ExpressionAttributeValues: {
      ':type': dataTypes.BACKEND,
    },
  };
  const result = await pageAwareQuery(params);
  return result;
};

module.exports = {
  createBackend,
  getAllBackends,
  createSeller,
  getSeller,
  getAllSellers,
  getSellerAccessCodes,
};
