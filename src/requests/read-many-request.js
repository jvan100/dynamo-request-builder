import FilterConditionAttribute from "../expressions/attributes/filter-condition-attribute.js";
import ReadRequest from "./read-request.js";

import { addFilterExpression } from "../expressions/add-expressions.js";
import { and } from "../expressions/logical-operators.js";

// Abstract read many request
class ReadManyRequest extends ReadRequest {
	// Add read start key
	exclusiveStartKey = (key) => {
		this.params.ExclusiveStartKey = key;
		return this;
	}

	// Execute and return requested items
	exec = async () => {
		const response = await this.execFullResponse();
		return response?.Items ?? [];
	}

	// Execute and return the count of the number of items found
	execCount = async () => {
		this.params.Select = "COUNT";

		const response = await this.execFullResponse();
		return response?.Count ?? 0;
	}

	// Execute and return a single item
	execSingle = async () => {
		this.params.Limit = 1;

		const response = await this.execFullResponse();
		return response?.Items[0] ?? null;
	}

	// Add a limit to the number of items returned
	limit = (limit) => {
		this.params.Limit = limit;
		return this;
	}

	// Read from the index provided
	useIndex = (indexName) => {
		this.params.IndexName = indexName;
		return this;
	}

	// Add filter expressions
	where = (...filterExpressions) => {
		const mergedFilterExpression = and(...filterExpressions);
		addFilterExpression(mergedFilterExpression, this.params);
		return this;
	}

	// Add a filter condition
	whereAttribute = (attributePath) => new FilterConditionAttribute(attributePath, false, this);

	// Add a size of filter condition
	whereSizeOfAttribute = (attributePath) => new FilterConditionAttribute(attributePath, true, this);
}

export default ReadManyRequest;