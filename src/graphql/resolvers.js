
const logger = require('../common/logger');

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

const sellers = [
  {
    name: 'mike',
    id: 'S1',
    email: 'mike@foo.com',
  },
  {
    name: 'jim',
    id: 'S2',
    email: 'jim@foo.com',
  },
];

const accessCodes = [
  {
    id: 'ac1',
    code: 'ABC-123',
    createDate: '2018-07-01',
    expireDate: '2020-01-01',
  },
];

const getSellers = (parent, args) => {
  logger.debug('getSellers():', parent, args);
  return sellers;
};

const getSeller = (parent, args) => {
  logger.debug('getSeller():', parent, args);
  return sellers[0];
};

const getAccessCodes = (parent, args) => {
  logger.debug('getAccessCodes():', parent, args);
  return accessCodes;
};

const resolvers = {
  Query: {
    backends: getBackends,
    sellers: getSellers,
    seller: getSeller,
  },
  Seller: {
    accessCodes: getAccessCodes,
  },
  AccessCode: {
    seller: getSeller,
  },
};

module.exports = resolvers;
