
const { UserInputError } = require('apollo-server-lambda');
const uuidv4 = require('uuid/v4');
const logger = require('../common/logger');
const {
  put,
  getAllSellers,
  getSeller,
  getSellerAccessCodes,
} = require('../common/dynamoClient');

const getBackends = (parent, args) => {
  logger.debug('getBackends():', parent, args);

  return [
    {
      id: '111',
      region: 'us-east-1',
      name: 'bongo-na',
      url: 'bongo-na.youseeu.com/graphql',
    },
  ];
};

const getSellers = async () => {
  const sellers = await getAllSellers();
  return sellers;
};

const getSingleSeller = async (parent) => {
  const results = await getSeller(parent.sellerId);
  return results[0];
};

const getAccessCodes = async (parent) => {
  const accessCodes = await getSellerAccessCodes(parent.id);
  return accessCodes;
};

const createSeller = async (parent, args) => {
  const { name, email } = args;
  console.log('create seller args:', name, email);

  if (!name || !email) {
    throw new UserInputError('Form Arguments invalid', {
      invalidArgs: Object.keys(args),
    });
  }

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

const resolvers = {
  Query: {
    backends: getBackends,
    sellers: getSellers,
    seller: getSingleSeller,
  },
  Mutation: {
    createSeller,
  },
  Seller: {
    accessCodes: getAccessCodes,
  },
  AccessCode: {
    seller: getSingleSeller,
  },
};

module.exports = resolvers;
