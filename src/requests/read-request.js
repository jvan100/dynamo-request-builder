import BaseRequest from "./base-request.js";

import { addProjectionExpression } from "../expressions/add-expressions.js";
import { getNamePlaceholder } from "../expressions/expression-utils.js";

// Read request
class ReadRequest extends BaseRequest {
	// Use consistent read
	consistentRead = () => {
		this.params.ConsistentRead = true;
		return this;
	}

	// Retrieve the specified attributes
	getAttributes = (...attributePaths) => {
		const projectionExpression = {
			attributeNames: {}
		};

		const namePlaceholders = [];

		attributePaths.forEach(attributePath => {
			let { namePlaceholder, attributeNames } = getNamePlaceholder(attributePath);

			namePlaceholders.push(namePlaceholder);
			projectionExpression.attributeNames = { ...projectionExpression.attributeNames, ...attributeNames };
		});

		projectionExpression.statement = namePlaceholders.join(", ");

		addProjectionExpression(projectionExpression, this.params);
		return this;
	}
}

export default ReadRequest;