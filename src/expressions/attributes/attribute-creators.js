import ConditionAttribute from "./condition-attribute.js";
import UpdateOperationAttribute from "./update-operation-attribute.js";

// Create a condition attribute
export const attribute = (attributePath) => new ConditionAttribute(attributePath, false);

// Create a size of condition attribute
export const sizeOf = (attributePath) => new ConditionAttribute(attributePath, true);

// Create an update operation attribute
export const update = (attributePath) => new UpdateOperationAttribute(attributePath);