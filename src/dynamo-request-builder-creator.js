// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDB_API.html

import DynamoRequestBuilder from "./dynamo-request-builder.js";

class DynamoRequestBuilderCreator {
	constructor(dynamoDocClient) {
		this.dynamoDocClient = dynamoDocClient;
	}

	// Create a request builder
	create = (tableName) => new DynamoRequestBuilder(this.dynamoDocClient, tableName);
}

export default DynamoRequestBuilderCreator;