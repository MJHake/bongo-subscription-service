# Bongo Subscription Service

# Run locally

```bash
yarn install
serverless dynamodb install
yarn start
```

## View seed data in local DyanmoDB instance
In web browser access the local DynamoDB console at: http://localhost:8000/shell/
and try the following request:

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
    TableName: 'bongo-subscription-service-dev',
   
};
dynamodb.scan(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});
```