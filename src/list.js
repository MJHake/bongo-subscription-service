

const { getAll } = require('./common/dynamoClient');

module.exports.list = async () => {
  const { DYNAMODB_TABLE } = process.env;

  try {
    const data = await getAll(DYNAMODB_TABLE);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch the todo item.',
    };
  }

};
