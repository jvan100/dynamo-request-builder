import WriteRequest from "./write-request.js";

// Abstract write with key request
class WriteWithKeyRequest extends WriteRequest {
	constructor(dynamoDocClient, command, tableName, key) {
		super(dynamoDocClient, command, tableName);

		this.params.Key = key;
	}

	// Specify a sort key
	withSortKey = (sortKeyName, sortKeyValue) => {
		this.params.Key[sortKeyName] = sortKeyValue;
		return this;
	}
}

export default WriteWithKeyRequest;