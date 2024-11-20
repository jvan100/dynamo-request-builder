import BaseConditionAttribute from "./base-condition-attribute.js";

import { addKeyConditionExpression } from "../add-expressions.js";

// A table attribute in a sort key condition expression
class SortKeyConditionAttribute extends BaseConditionAttribute {
	constructor(attributePath, useSizeOf, request = null) {
		super(attributePath, useSizeOf, request, addKeyConditionExpression);
	}
}

export default SortKeyConditionAttribute;