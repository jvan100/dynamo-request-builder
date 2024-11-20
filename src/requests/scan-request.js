import { ScanCommand } from "@aws-sdk/lib-dynamodb";

import ReadManyRequest from "./read-many-request.js";

// Scan request
class ScanRequest extends ReadManyRequest {
	constructor(dynamoDocClient, tableName) {
		super(dynamoDocClient, ScanCommand, tableName);
	}
}

export default ScanRequest;