// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

import { getCreateBetweenExpressionFunc, getCreateBinaryFunctionExpressionFunc, getCreateComparatorExpressionFunc } from "../create-expression-funcs/create-condition-expression-funcs.js";
import { getNamePlaceholder, getUniqueValuePlaceholder } from "../expression-utils.js";

// Base table attribute in a condition expression
class BaseConditionAttribute {
	constructor(attributePath, useSizeOf, request, addExpression) {
		this.attributePath = attributePath;
		this.useSizeOf = useSizeOf;
		this.request = request;
		this.addExpression = addExpression;
	}

	// Create the expression using the provided createExpression function
	create = (createExpression) => {
		let { namePlaceholder, attributeNames } = getNamePlaceholder(this.attributePath);

		if (this.useSizeOf) {
			namePlaceholder = `size(${namePlaceholder})`;
		}

		const valuePlaceholder = getUniqueValuePlaceholder(this.attributePath);

		const expression = { ...createExpression(namePlaceholder, valuePlaceholder), attributeNames };

		// If a request is provided, add the expression to it
		if (this.request) {
			this.addExpression(expression, this.request.params);
			return this.request;
		} else {
			return expression;
		}
	}

	// Check if the string attribute begins with a substring
	beginsWith = (subString) => this.create(getCreateBinaryFunctionExpressionFunc("begins_with", subString));

	// Check if the numerical attribute is between two values
	between = (value1, value2) => this.create(getCreateBetweenExpressionFunc(this.attributePath, value1, value2));

	// Check if the attribute is equal to a value
	eq = (value) => this.create(getCreateComparatorExpressionFunc("=", value));

	// Check if the attribute is not equal to a value
	ne = (value) => this.create(getCreateComparatorExpressionFunc("<>", value));

	// Check if the numerical attribute is less than a value
	lt = (value) => this.create(getCreateComparatorExpressionFunc("<", value));

	// Check if the numerical attribute is greater than a value
	gt = (value) => this.create(getCreateComparatorExpressionFunc(">", value));

	// Check if the numerical attribute is less than or equal to a value
	lte = (value) => this.create(getCreateComparatorExpressionFunc("<=", value));

	// Check if the numerical attribute is greater than or equal to a value
	gte = (value) => this.create(getCreateComparatorExpressionFunc(">=", value));
}

export default BaseConditionAttribute;