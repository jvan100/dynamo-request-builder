// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

import { getUniqueExpressionAttributeValues } from "./expression-utils.js";

const mergeConditionExpressions = (operator, expressions) => {
	const statements = [];

	const mergedExpression = expressions.reduce((result, expression) => {
		result.attributeNames = { ...result.attributeNames, ...expression.attributeNames };

		const attributeValues = getUniqueExpressionAttributeValues(expression, result.attributeValues);
		result.attributeValues = { ...result.attributeValues, ...attributeValues };

		statements.push(expression.statement);

		return result;
	}, {});

	mergedExpression.statement = statements.length === 1
		? statements[0]
		: `(${statements.join(` ${operator} `)})`;

	return mergedExpression;
};

// AND operator for condition expressions
export const and = (...conditionExpressions) => mergeConditionExpressions("AND", conditionExpressions);

// OR operator for condition expressions
export const or = (...conditionExpressions) => mergeConditionExpressions("OR", conditionExpressions);

// NOT operator for a condition expression
export const not = (conditionExpression) => ({
	...conditionExpression,
	statement: `NOT ${conditionExpression.statement}`
});