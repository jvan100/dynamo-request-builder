// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html

import { addUpdateExpression } from "../add-expressions.js";
import { getCreateAddExpressionFunc, getCreateAppendToListExpressionFunc, getCreateBinaryOperatorExpressionFunc, getCreateSetExpressionFunc, getCreateRemoveExpressionFunc, getCreateRemoveFromListAtExpressionFunc, getCreateRemoveFromSetExpressionFunc } from "../create-expression-funcs/create-update-expression-funcs.js";
import { getNamePlaceholder, getUniqueValuePlaceholder } from "../expression-utils.js";

// A table attribute in an update operation expression
class UpdateOperationAttribute {
	constructor(attributePath, request = null) {
		this.attributePath = attributePath;
		this.request = request;
	}

	// Create the expression using the provided createExpression function
	create = (createExpression) => {
		const { namePlaceholder, attributeNames } = getNamePlaceholder(this.attributePath);
		const valuePlaceholder = getUniqueValuePlaceholder(this.attributePath);

		let expression = { ...createExpression(namePlaceholder, valuePlaceholder), attributeNames };

		// If a request is provided, add the expression to it
		if (this.request) {
			addUpdateExpression(expression, this.request.params);
			return this.request;
		} else {
			return expression;
		}
	}

	/* 
	* Add:
	*   - a numerical value to the numerical attribute
	*   - values to the set attribute
	*/
	add = (...values) => this.create(getCreateAddExpressionFunc(values));

	// Increment the numerical attribute by 1
	increment = () => this.incrementBy(1);

	// Increment the numerical attribute by a value
	incrementBy = (value) => this.create(getCreateBinaryOperatorExpressionFunc("+", value));

	// Decrement the numerical attribute by 1
	decrement = () => this.decrementBy(1);

	// Decrement the numerical attribute by a value
	decrementBy = (value) => this.create(getCreateBinaryOperatorExpressionFunc("-", value));

	// Append values to the start of the list attribute
	appendToStartOfList = (...values) => this.appendToList(values, true);

	// Append values to the end of the list attribute
	appendToEndOfList = (...values) => this.appendToList(values);

	// Append values to the list attribute (defaults to the start of the list)
	appendToList = (values, appendToStart = false) => this.create(getCreateAppendToListExpressionFunc(values, appendToStart));

	// Set the value of the attribute (optional only set the value if the attribute doesn't exist)
	set = (value, ifNotExists = false) => this.create(getCreateSetExpressionFunc(value, ifNotExists));

	// Remove the attribute
	remove = () => this.create(getCreateRemoveExpressionFunc());

	// Remove elements from the list attribute at the specific indices
	removeFromListAt = (...indices) => this.create(getCreateRemoveFromListAtExpressionFunc(indices));

	// Remove values from the set attribute
	removeFromSet = (...values) => this.create(getCreateRemoveFromSetExpressionFunc(values));
}

export default UpdateOperationAttribute;