import { PutCommand } from "@aws-sdk/lib-dynamodb";

import WriteRequest from "./write-request.js";

import { attribute } from "../expressions/attributes/attribute-creators.js";

// Put request
class PutRequest extends WriteRequest {
	constructor(dynamoDocClient, tableName, item) {
		super(dynamoDocClient, PutCommand, tableName);

		this.params.Item = item;
	}

	// Add item not exists condition
	ifItemNotExists = (partitionKeyName, sortKeyName = null) => {
		const conditionExpressions = [
			attribute(partitionKeyName).notExists()
		];

		if (sortKeyName) {
			conditionExpressions.push(attribute(sortKeyName).notExists());
		}

		return this.onlyIf(...conditionExpressions);
	}
}

export default PutRequest;