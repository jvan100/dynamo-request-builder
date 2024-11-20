const DOCUMENT_DOT_REGEX = /\./g;
const DOCUMENT_INDEX_REGEX = /\[(\d+)]/g;
const DOCUMENT_PATH_REGEX = /^.+(?:\[\d+]|\.).*$/;
const DOCUMENT_PATH_CAPTURE_REGEX = /([a-z0-9A-Z_]+)(?:\[(\d+)])?\.?/g;

// Get a name placeholder and attribute names from an attribute path
export const getNamePlaceholder = (attributePath) => {
	let namePlaceholder;

	const attributeNames = {};

	// Test if the attribute path contains a document attribute - list or map
	if (new RegExp(DOCUMENT_PATH_REGEX).test(attributePath)) {
		const captureRegex = new RegExp(DOCUMENT_PATH_CAPTURE_REGEX);

		const placeholders = [];

		let result;

		while ((result = captureRegex.exec(attributePath)) !== null) {
			const [_, path, index] = result;

			namePlaceholder = `#${path}`;
			attributeNames[namePlaceholder] = path;

			// List index
			if (index) {
				placeholders.push(`${namePlaceholder}[${index}]`);
			} else {
				placeholders.push(namePlaceholder);
			}
		}

		namePlaceholder = placeholders.join(".");
	} else {
		// top level attribute
		namePlaceholder = `#${attributePath}`;
		attributeNames[namePlaceholder] = attributePath;
	}

	return { namePlaceholder, attributeNames };
};

// Get a unique value placeholder not in the existing value placeholders provided
export const getUniqueValuePlaceholder = (attributePath, existingValuePlaceholders) => {
	// Replace dot notation with "__" and expression index notation with "_at_i" in attribute path
	attributePath = attributePath.replace(DOCUMENT_DOT_REGEX, "__").replace(DOCUMENT_INDEX_REGEX, (_, args) => `_at_${args[0]}`);

	let placeholder = `:${attributePath}`;

	if (existingValuePlaceholders && existingValuePlaceholders.length) {
		// Increment suffix until a new placeholder is found
		let suffix = 2;

		while (existingValuePlaceholders.includes(placeholder)) {
			placeholder = `:${attributePath}_${suffix++}`;
		}
	}

	return placeholder;
};

// Get unique attribute values of an expression not in the existing attribute values provided
export const getUniqueExpressionAttributeValues = (expression, existingAttributeValues) => {
	const existingValuePlaceholders = Object.keys(existingAttributeValues ?? {});

	const attributeValues = {};

	// Create unique value placeholders for the expression being merged
	Object.keys(expression.attributeValues ?? {}).forEach(valuePlaceholder => {
		const uniqueValuePlaceholder = getUniqueValuePlaceholder(valuePlaceholder.replace(":", ""), existingValuePlaceholders);

		if (valuePlaceholder !== uniqueValuePlaceholder) {
			// Replace all instances of the old placeholder with the new unique placeholder in the expression's statement
			expression.statement = expression.statement.replace(valuePlaceholder, uniqueValuePlaceholder);
			existingValuePlaceholders.push(uniqueValuePlaceholder);
		}

		attributeValues[uniqueValuePlaceholder] = expression.attributeValues[valuePlaceholder];
	});

	return attributeValues;
};