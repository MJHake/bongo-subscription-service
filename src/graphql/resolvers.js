
const { UserInputError } = require('apollo-server-lambda');
const logger = require('../common/logger');
const DataService = require('../common/dataService');

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
  const sellers = await DataService.getAllSellers();
  return sellers;
};

const getSellerForAccessCode = async (parent) => {
  const results = await DataService.getSeller(parent.sellerId);
  return results[0];
};

const getSingleSeller = async (parent, args) => {
  const { id } = args;
  const results = await DataService.getSeller(id);
  return results[0];
};

const getAccessCodes = async (parent) => {
  const accessCodes = await DataService.getSellerAccessCodes(parent.id);
  return accessCodes;
};

const createSeller = async (parent, args) => {
  const { name, email } = args;

  if (!name || !email) {
    throw new UserInputError('Form Arguments invalid', {
      invalidArgs: Object.keys(args),
    });
  }

  const newSeller = await DataService.createSeller(name, email);
  return newSeller;
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
    seller: getSellerForAccessCode,
  },
};

module.exports = resolvers;
