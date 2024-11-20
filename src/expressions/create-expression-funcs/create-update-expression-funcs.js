// Get a create binary operator expression function
export const getCreateBinaryOperatorExpressionFunc = (operator, value) => (namePlaceholder, valuePlaceholder) => {
	const statement = `SET ${namePlaceholder} = ${namePlaceholder} ${operator} ${valuePlaceholder}`;

	return {
		statement,
		attributeValues: {
			[valuePlaceholder]: value
		}
	};
};

// Get a create ADD expression function
export const getCreateAddExpressionFunc = (values) => (namePlaceholder, valuePlaceholder) => {
	const statement = `ADD ${namePlaceholder} ${valuePlaceholder}`;

	return {
		statement,
		attributeValues: {
			[valuePlaceholder]: values.length === 1 ? values[0] : values
		}
	};
};

// Get a create append to list expression function
export const getCreateAppendToListExpressionFunc = (values, appendToStart) => (namePlaceholder, valuePlaceholder) => {
	const placeholders = appendToStart
		? `${valuePlaceholder}, ${namePlaceholder}`
		: `${namePlaceholder}, ${valuePlaceholder}`;

	const statement = `SET ${namePlaceholder} = list_append(${placeholders})`;

	return {
		statement,
		attributeValues: {
			[valuePlaceholder]: values
		}
	};
};

// Get a create SET expression function
export const getCreateSetExpressionFunc = (value, ifNotExists) => (namePlaceholder, valuePlaceholder) => {
	const placeholders = ifNotExists
		? `if_not_exists(${namePlaceholder}, ${valuePlaceholder})`
		: valuePlaceholder;

	const statement = `SET ${namePlaceholder} = ${placeholders}`;

	return {
		statement,
		attributeValues: {
			[valuePlaceholder]: value
		}
	}
};

// Get a create REMOVE expression function
export const getCreateRemoveExpressionFunc = () => (namePlaceholder, _) => ({
	statement: `REMOVE ${namePlaceholder}`
});

// Get a create remove from list expression function
export const getCreateRemoveFromListAtExpressionFunc = (indices) => (namePlaceholder, _) => {
	const statement = `REMOVE ${indices.map(index => `${namePlaceholder}[${index}]`).join(", ")}`;

	return {
		statement
	};
};

// Get a create remove from set expression function
export const getCreateRemoveFromSetExpressionFunc = (values) => (namePlaceholder, valuePlaceholder) => {
	const statement = `DELETE ${namePlaceholder} ${valuePlaceholder}`;

	return {
		statement,
		attributeValues: {
			[valuePlaceholder]: values
		}
	};
};