import ExpressionType from "./expression-type.js";

import { getUniqueExpressionAttributeValues } from "./expression-utils.js";

const ACTION_KEYWORDS_REGEX = /\s(ADD|SET|REMOVE|DELETE)\s/g;

// Merge two update statements together
const mergeUpdateStatements = (statement1, statement2) => {
	// Split the statements into their action keywords and corresponding actions
	const statement1ActionsByActionKeyword = splitUpdateStatementByActionKeyword(statement1);
	const statement2ActionsByActionKeyword = splitUpdateStatementByActionKeyword(statement2);

	return Array.from(new Set([...Object.keys(statement1ActionsByActionKeyword), ...Object.keys(statement2ActionsByActionKeyword)])) // Combine the action keywords and ensure no duplicates
		.map(keyword => {
			// Combine the action keyword and all actions from both statements
			const statement1Actions = statement1ActionsByActionKeyword[keyword];
			const statement2Actions = statement2ActionsByActionKeyword[keyword];

			let actions = !statement1Actions
				? statement2Actions
				: (!statement2Actions
					? statement1Actions
					: `${statement1Actions}, ${statement2Actions}`);

			return `${keyword} ${actions}`;
		})
		.join(" ");
}

// Split an update statement into it's action keywords and corresponding actions
const splitUpdateStatementByActionKeyword = (statement) => {
	const statementParts = ` ${statement}`.split(ACTION_KEYWORDS_REGEX);

	const actionsByKeyword = {};

	for (let i = 1; i < statementParts.length; i += 2) {
		const actionKeyword = statementParts[i];
		actionsByKeyword[actionKeyword] = statementParts[i + 1];
	}

	return actionsByKeyword;
}

// Add an expression to a request's parameters
export const addExpression = (expressionType, expression, params) => {
	// Add the expression's attribute names
	if (Object.keys(expression.attributeNames ?? {}).length > 0) {
		params.ExpressionAttributeNames = { ...params.ExpressionAttributeNames, ...expression.attributeNames };
	}

	// Add the expression's attribute values
	if (Object.keys(expression.attributeValues ?? {}).length > 0) {
		const attributeValues = getUniqueExpressionAttributeValues(expression, params.ExpressionAttributeValues);
		params.ExpressionAttributeValues = { ...params.ExpressionAttributeValues, ...attributeValues };
	}

	// Merge the expression statement based off of the expression type
	let statement = params[expressionType];

	if (statement) {
		switch (expressionType) {
			case ExpressionType.ConditionExpression:
			case ExpressionType.FilterExpression:
			case ExpressionType.KeyConditionExpression:
				statement = `${statement} AND ${expression.statement}`;
				break;
			case ExpressionType.UpdateExpression:
				statement = mergeUpdateStatements(statement, expression.statement);
				break;
			default:
				statement = expression.statement;
				break;
		}
	} else {
		statement = expression.statement;
	}

	params[expressionType] = statement;
};

export const addConditionExpression = (conditionExpression, params) => addExpression(ExpressionType.ConditionExpression, conditionExpression, params);

export const addFilterExpression = (filterExpression, params) => addExpression(ExpressionType.FilterExpression, filterExpression, params);

export const addKeyConditionExpression = (keyConditionExpression, params) => addExpression(ExpressionType.KeyConditionExpression, keyConditionExpression, params);

export const addProjectionExpression = (projectionExpression, params) => addExpression(ExpressionType.ProjectionExpression, projectionExpression, params);

export const addUpdateExpression = (updateExpression, params) => addExpression(ExpressionType.UpdateExpression, updateExpression, params);