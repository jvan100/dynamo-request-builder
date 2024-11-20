import ConditionAttribute from "./condition-attribute.js";

import { addFilterExpression } from "../add-expressions.js";

class FilterConditionAttribute extends ConditionAttribute {
	constructor(attributePath, useSizeOf, request = null) {
		super(attributePath, useSizeOf, request, addFilterExpression);
	}
}

export default FilterConditionAttribute;