import { GetCommand } from "@aws-sdk/lib-dynamodb";

import ReadRequest from "./read-request.js";

// Get request
class GetRequest extends ReadRequest {
	constructor(dynamoDocClient, tableName, key) {
		super(dynamoDocClient, GetCommand, tableName);

		this.params.Key = key;
	}

	// Execute and return requested item
	exec = async () => {
		const response = await this.execFullResponse();
		return response?.Item;
	}

	// Specify a sort key
	withSortKey = (sortKeyName, sortKeyValue) => {
		this.params.Key[sortKeyName] = sortKeyValue;
		return this;
	}
}

export default GetRequest;