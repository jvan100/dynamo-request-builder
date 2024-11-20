import { getUniqueValuePlaceholder } from "../expression-utils.js";

// Create a default expression with a statement and attribute values
const createDefaultExpression = (statement, valuePlaceholder, value = null) => {
	const expression = {
		statement
	};

	if (value) {
		expression.attributeValues = {
			[valuePlaceholder]: value
		};
	}

	return expression;
}

// Get a create comparator expression function
export const getCreateComparatorExpressionFunc = (operator, value) => (namePlaceholder, valuePlaceholder) => {
	const statement = `${namePlaceholder} ${operator} ${valuePlaceholder}`;
	return createDefaultExpression(statement, valuePlaceholder, value);
};

// Get a create unary function expression function
export const getCreateUnaryFunctionExpressionFunc = (funcName) => (namePlaceholder, valuePlaceholder) => {
	const statement = `${funcName}(${namePlaceholder})`;
	return createDefaultExpression(statement, valuePlaceholder);
};

// Get a create binary function expression function
export const getCreateBinaryFunctionExpressionFunc = (funcName, value) => (namePlaceholder, valuePlaceholder) => {
	const statement = `${funcName}(${namePlaceholder}, ${valuePlaceholder})`;
	return createDefaultExpression(statement, valuePlaceholder, value);
};

// Get a create IN expression function
export const getCreateInExpressionFunc = (attributePath, values) => (namePlaceholder, valuePlaceholder) => {
	const existingValuePlaceholders = [];

	const attributeValues = values.reduce((result, value) => {
		result[valuePlaceholder] = value;

		existingValuePlaceholders.push(valuePlaceholder);
		valuePlaceholder = getUniqueValuePlaceholder(attributePath, existingValuePlaceholders);

		return result;
	}, {});

	return {
		statement: `${namePlaceholder} IN (${Object.keys(attributeValues).join(", ")})`,
		attributeValues
	};
};

// Get a create BETWEEN expression function
export const getCreateBetweenExpressionFunc = (attributePath, value1, value2) => (namePlaceholder, value1Placeholder) => {
	const value2Placeholder = getUniqueValuePlaceholder(attributePath, [value1Placeholder]);

	return {
		statement: `${namePlaceholder} BETWEEN ${value1Placeholder} AND ${value2Placeholder}`,
		attributeValues: {
			[value1Placeholder]: value1,
			[value2Placeholder]: value2
		}
	};
};