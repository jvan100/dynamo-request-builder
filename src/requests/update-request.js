import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

import UpdateOperationAttribute from "../expressions/attributes/update-operation-attribute.js";
import WriteWithKeyRequest from "./write-with-key-request.js";

import { addUpdateExpression } from "../expressions/add-expressions.js";

// Update request
class UpdateRequest extends WriteWithKeyRequest {
	constructor(dynamoDocClient, tableName, key) {
		super(dynamoDocClient, UpdateCommand, tableName, key);
	}

	// Add update expressions
	operations = (...updateExpressions) => {
		updateExpressions.forEach(updateExpression => addUpdateExpression(updateExpression, this.params));
		return this;
	}

	// Add an update operation
	updateAttribute = (attributePath) => new UpdateOperationAttribute(attributePath, this);
}

export default UpdateRequest;