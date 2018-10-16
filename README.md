# Bongo Subscription Service

# Run locally

```bash
yarn install
serverless dynamodb install  // first time only
yarn start
```

Then, in a separate terminal launch the integration tests:

```bash
yarn integration-test
```

## View seed data in local DynamoDB instance
When the app is started in offline mode, an offline DynamoDB is started and pre populated
with the seed data at offline/migrations/table-seed.json. You can run queries directly against
the offline DynamoDB by pointing a web browser at: http://localhost:8000/shell/

Below are some queries to try:

### List tables:
```javascript
var params = {
};
dynamodb.listTables(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});
```

### Scan entire table:
```javascript
var params = {
    TableName: 'global-subscription-service-dev',
   
};
dynamodb.scan(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});
```