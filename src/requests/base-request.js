// Abstract base request
class BaseRequest {
	constructor(dynamoDocClient, command, tableName) {
		this.dynamoDocClient = dynamoDocClient;
		this.command = command;
		this.params = {
			TableName: tableName
		};
	}

	// Execute command and return the full response
	execFullResponse = async () => {
		const command = new this.command(this.params);
		return await this.dynamoDocClient.send(command);
	}
}

export default BaseRequest;