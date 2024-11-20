import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

import WriteWithKeyRequest from "./write-with-key-request.js";

// Delete request
class DeleteRequest extends WriteWithKeyRequest {
	constructor(dynamoDocClient, tableName, key) {
		super(dynamoDocClient, DeleteCommand, tableName, key);
	}
}

export default DeleteRequest;