
const { UserInputError } = require('apollo-server-lambda');
const DataService = require('../common/dataService');

const getBackends = async () => {
  const backends = await DataService.getAllBackends();
  return backends;
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

const createNewSeller = async (parent, args) => {
  const { name, email } = args;
  if (!name || !email) {
    throw new UserInputError('Form Arguments invalid', {
      invalidArgs: Object.keys(args),
    });
  }
  const newSeller = await DataService.createSeller(name, email);
  return newSeller;
};

const createNewBackend = async (parent, args) => {
  const { name, url, region } = args;
  if (!name || !url || !region) {
    throw new UserInputError('Form Arguments invalid', {
      invalidArgs: Object.keys(args),
    });
  }
  const newBackend = await DataService.createBackend(name, url, region);
  return newBackend;
};

const resolvers = {
  Query: {
    backends: getBackends,
    sellers: getSellers,
    seller: getSingleSeller,
  },
  Mutation: {
    createSeller: createNewSeller,
    registerBackend: createNewBackend,
  },
  Seller: {
    accessCodes: getAccessCodes,
  },
  AccessCode: {
    seller: getSellerForAccessCode,
  },
};

module.exports = resolvers;
