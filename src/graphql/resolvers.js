
const logger = require('../common/logger');
const {
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

const resolvers = {
  Query: {
    backends: getBackends,
    sellers: getSellers,
    seller: getSingleSeller,
  },
  Seller: {
    accessCodes: getAccessCodes,
  },
  AccessCode: {
    seller: getSingleSeller,
  },
};

module.exports = resolvers;
