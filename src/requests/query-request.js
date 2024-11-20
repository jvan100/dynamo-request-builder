import { QueryCommand } from "@aws-sdk/lib-dynamodb";

import ReadManyRequest from "./read-many-request.js";
import SortKeyConditionAttribute from "../expressions/attributes/sort-key-condition-attribute.js";

import { addKeyConditionExpression } from "../expressions/add-expressions.js";
import { attribute } from "../expressions/attributes/attribute-creators.js";

// Query request
class QueryRequest extends ReadManyRequest {
	constructor(dynamoDocClient, tableName, partitionKeyName, partitionKeyValue) {
		super(dynamoDocClient, QueryCommand, tableName);

		const keyConditionExpression = attribute(partitionKeyName).eq(partitionKeyValue);
		addKeyConditionExpression(keyConditionExpression, this.params);
	}

	// Scan the index in descending order
	scanIndexDescending = () => {
		this.params.ScanIndexForward = false;
		return this;
	}

	// Add key condition expression for sort key
	whereSortKey = (sortKeyName) => new SortKeyConditionAttribute(sortKeyName, false, this);
}

export default QueryRequest;