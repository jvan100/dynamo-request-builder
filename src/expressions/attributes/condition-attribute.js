// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

import BaseConditionAttribute from "./base-condition-attribute.js";

import { addConditionExpression } from "../add-expressions.js";
import { getCreateBinaryFunctionExpressionFunc, getCreateInExpressionFunc, getCreateUnaryFunctionExpressionFunc } from "../create-expression-funcs/create-condition-expression-funcs.js";

// A table attribute in a condition expression
class ConditionAttribute extends BaseConditionAttribute {
	constructor(attributePath, useSizeOf, request = null, addExpression = addConditionExpression) {
		super(attributePath, useSizeOf, request, addExpression);
	}

	// Check if the attribute exists
	exists = () => this.create(getCreateUnaryFunctionExpressionFunc("attribute_exists"));

	// Check if the attribute doesn't exist
	notExists = () => this.create(getCreateUnaryFunctionExpressionFunc("attribute_not_exists"));

	/* 
	* Check if:
	*   - a string contains a substring
	*   - a set or list contains an element
	*/
	contains = (value) => this.create(getCreateBinaryFunctionExpressionFunc("contains", value));

	/* 
	* Check if:
	*   - a string doesn't contain a substring
	*   - a set or list doesn't contain an element
	*/
	notContains = (value) => this.create(getCreateBinaryFunctionExpressionFunc("not_contains", value));

	// Check if an attribute is of a type
	ofType = (type) => this.create(getCreateBinaryFunctionExpressionFunc("attribute_type", type));

	// Check if an attribute is in a list of values
	in = (...values) => this.create(getCreateInExpressionFunc(this.attributePath, values));
}

export default ConditionAttribute;