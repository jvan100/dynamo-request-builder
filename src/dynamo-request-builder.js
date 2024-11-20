/* Dynamo request builder class */
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html

import { DeleteRequest, GetRequest, PutRequest, QueryRequest, ScanRequest, UpdateRequest } from "./requests/index.js";

class DynamoRequestBuilder {
	constructor(dynamoDocClient, tableName) {
		this.dynamoDocClient = dynamoDocClient;
		this.tableName = tableName;
	}

	// Create a table key
	createKey = (partitionKeyName, partitionKeyValue) => ({ [partitionKeyName]: partitionKeyValue });

	// Create a delete request
	delete = (partitionKeyName, partitionKeyValue) => new DeleteRequest(this.dynamoDocClient, this.tableName, this.createKey(partitionKeyName, partitionKeyValue));

	// Create a get request
	get = (partitionKeyName, partitionKeyValue) => new GetRequest(this.dynamoDocClient, this.tableName, this.createKey(partitionKeyName, partitionKeyValue));

	// Create a put request
	put = (item) => new PutRequest(this.dynamoDocClient, this.tableName, item);

	// Create a query request
	query = (partitionKeyName, partitionKeyValue) => new QueryRequest(this.dynamoDocClient, this.tableName, partitionKeyName, partitionKeyValue);

	// Create a scan request
	scan = () => new ScanRequest(this.dynamoDocClient, this.tableName);

	// Create an update request
	update = (partitionKeyName, partitionKeyValue) => new UpdateRequest(this.dynamoDocClient, this.tableName, this.createKey(partitionKeyName, partitionKeyValue));
}

export default DynamoRequestBuilder;