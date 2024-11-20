import BaseRequest from "./base-request.js";
import ConditionAttribute from "../expressions/attributes/condition-attribute.js";

import { addConditionExpression } from "../expressions/add-expressions.js";
import { and } from "../expressions/logical-operators.js";

// Abstract write request
class WriteRequest extends BaseRequest {
	// Execute and return requested attributes
	exec = async () => {
		const response = await this.execFullResponse();
		return response?.Attributes;
	}

	// Add condition expressions
	onlyIf = (...conditionExpressions) => {
		const mergedExpression = and(...conditionExpressions);
		addConditionExpression(mergedExpression, this.params);
		return this;
	}

	// Add a condition
	onlyIfAttribute = (attributePath) => new ConditionAttribute(attributePath, false, this);

	// Add a size of condition
	onlyIfSizeOfAttribute = (attributePath) => new ConditionAttribute(attributePath, true, this);

	// Use the provided return values
	returnValues = (returnValues) => {
		this.params.ReturnValues = returnValues;
		return this;
	}
}

export default WriteRequest;