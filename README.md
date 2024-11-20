# Dynamo Request Builder
An intuitive DynamoDB request building API for JavaScript.

## Contents
- [Installation](#installation)
- [Creating Requests](#creating-requests)
- [Attributes](#attributes)
- [Logical Operators](#logical-operators)
- [Executing Requests](#executing-requests)

## Installation

```shell
npm install dynamo-request-builder
```

## Creating Requests

Use the `DynamoRequestBuilderCreator` with a DynamoDB `DocumentClient` to create a `DynamoRequestBuilder`.

```javascript
import DynamoRequestBuilderCreator from "dynamo-request-builder";

const requestBuilder = new DynamoRequestBuilderCreator(dynamoDocClient).create("table_name");
```

### Delete

```javascript
import { attribute, sizeOf } from "dynamo-request-builder/attributes";
import { or } from "dynamo-request-builder/operators";
import { ReturnValues } from "dynamo-request-builder/return-values";

const request = requestBuilder.delete("partitionKeyName", "partitionKeyValue")
  .withSortKey("sortKeyName", "sortKeyValue") // Sort key condition
  .onlyIfAttribute("attribute").eq("value") // Add an attribute condition
  .onlyIfSizeOfAttribute("attribute").lte(1) // Add a size of attribute condition
  .onlyIf(
    or(attribute("attribute1").gte(1), attribute("attribute2").contains("value")),
    sizeOf("attribute3").eq(2)
  ) // Add multiple attribute conditions
  .returnValues(ReturnValues.AllOld); // Specify values to return
```

### Get
```javascript
const request = requestBuilder.get("partitionKeyName", "partitionKeyValue")
  .withSortKey("sortKeyName", "sortKeyValue") // Sort key condition
  .getAttributes("attribute", "attribute[0]", "attribute[0].subAttribute") // Specify attributes to retrieve
  .consistentRead(); // Use consistent read
```

### Put
```javascript
import { attribute, sizeOf } from "dynamo-request-builder/attributes";
import { not } from "dynamo-request-builder/operators";
import { ReturnValues } from "dynamo-request-builder/return-values";

const item = {
  ...
};

const request = requestBuilder.put(item)
  .ifItemNotExists("partitionKeyName", "sortKeyName") // Only put the item if it doesn't already exist
  .onlyIfAttribute("attribute").eq("value") // Add an attribute condition
  .onlyIfSizeOfAttribute("attribute").lte(1) // Add a size of attribute condition
  .onlyIf(
	  not(attribute("attribute1").gte(1)),
	  sizeOf("attribute3").eq(2)
  ) // Add multiple attribute conditions
  .returnValues(ReturnValues.AllOld); // Specify values to return
```

### Query
```javascript
import { attribute, sizeOf } from "dynamo-request-builder/attributes";
import { or } from "dynamo-request-builder/operators";

const request = requestBuilder.query("partitionKeyName", "partitionKeyValue")
  .whereSortKey("sortKeyName").beginsWith("value") // Add a sort key condition
  .whereAttribute("attribute").eq("value") // Add an attribute condition
  .whereSizeOfAttribute("attribute").lt(1) // Add a size of attribute condition
  .where(
    or(attribute("attribute1").gte(1), attribute("attribute2").contains("value")),
    sizeOf("attribute3").eq(2)
  ) // Add multiple attribute conditions
  .getAttributes("attribute", "attribute[0]", "attribute[0].subAttribute") // Specify attributes to retrieve
  .limit(5) // Specify a limit on the number of items to return
  .useIndex("indexName") // Specify an index to use
  .scanIndexDescending(); // Scan the index in descending order
```

### Scan
```javascript
import { attribute, sizeOf } from "dynamo-request-builder/attributes";
import { or } from "dynamo-request-builder/operators";

const request = requestBuilder.scan()
  .whereAttribute("attribute").eq("value") // Add an attribute condition
  .whereSizeOfAttribute("attribute").lt(1) // Add a size of attribute condition
  .where(
    or(attribute("attribute1").gte(1), attribute("attribute2").contains("value")),
    sizeOf("attribute3").eq(2)
  ) // Add multiple attribute conditions
  .getAttributes("attribute", "attribute[0]", "attribute[0].subAttribute") // Specify attributes to retrieve
  .limit(5) // Specify a limit on the number of items to return
  .useIndex("indexName") // Specify an index to use
```

### Update
```javascript
import { attribute, sizeOf, update } from "dynamo-request-builder/attributes";
import { or } from "dynamo-request-builder/operators";

const request = requestBuilder.update("partitionKeyName", "partitionKeyValue")
  .withSortKey("sortKeyName", "sortKeyValue") // Sort key condition
  .updateAttribute("attribute").incrementBy(5) // Add an update operation
  .operations(update("attribute1").add(1, 2, 3), update("attribute2").remove()) // Add multiple update operations
  .onlyIfAttribute("attribute").eq("value") // Add an attribute condition
  .onlyIfSizeOfAttribute("attribute").lte(1) // Add a size of attribute condition
  .onlyIf(
    or(attribute("attribute1").gte(1), attribute("attribute2").contains("value")),
    sizeOf("attribute3").eq(2)
  ) // Add multiple attribute conditions
  .returnValues(UpdateReturnValues.UpdatedNew); // Specify values to return
```

You can check the generated request parameters for yourself by accessing `request.params`.

## Attributes

The ability to select specific attributes and apply constraint conditions and update operations to them are needed for certain expressions.

<table>
    <tr>
        <th>Attribute Type</th>
        <th>Attribute Selectors</th>
        <th>Use Cases</th>
        <th>Methods</th>
    </tr>
    <tr>
        <td>Condition Attribute</td>
        <td style="text-align: center"><code>attribute(attributePath)</code>, <code>sizeOf(attributePath)</code></td>
        <td>
            Condition Expressions
            <ul>
                <li><code>onlyIfAttribute(attributePath)</code></li>
                <li><code>onlyIfSizeOfAttribute(attributePath)</code></li>
                <li><code>onlyIf(...conditionExpressions)</code></li>
            </ul>
            <br>
            Filter Expressions
            <ul>
                <li><code>whereAttribute(attributePath)</code></li>
                <li><code>whereSizeOfAttribute(attributePath)</code></li>
                <li><code>where(...filterExpressions)</code></li>
            </ul>
            <br>
            Key Condition Expressions
            <ul>
                <li><code>whereSortKey(sortKeyName)</code></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><code>beginsWith(subString)</code> - Check if the string attribute begins with a substring</li>
                <li><code>between(value1, value2)</code> - Check if the numerical attribute is between two values</li>
                <li><code>eq(value)</code> - Check if the attribute is equal to a value</li>
                <li><code>ne(value)</code> - Check if the attribute is not equal to a value</li>
                <li><code>lt(value)</code> - Check if the numerical attribute is less than a value </li>
                <li><code>gt(value)</code> - Check if the numerical attribute is greater than a value</li>
                <li><code>lte(value)</code> - Check if the numerical attribute is less than or equal to a value</li>
                <li><code>gte(value)</code> - Check if the numerical attribute is greater than or equal to a value</li>
                <li><code>exists()</code> - Check if the attribute exists</li>
                <li><code>notExists()</code> - Check if the attribute doesn't exist</li>
                <li><code>contains(value)</code> - Check if a string contains a substring or a set or list contains an element</li>
                <li><code>notContains(value)</code> - Check if a string doesn't contain a substring or a set or list doesn't contain an element</li>
                <li><code>ofType(type)</code> - Check if an attribute is of a type</li>
                <li><code>in(...values)</code> - Check if an attribute is in a list of values</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>Update Operation Attribute</td>
        <td style="text-align: center"><code>update(attributePath)</code></td>
        <td>
            Update Expressions
            <ul>
                <li><code>updateAttribute(attributePath)</code></li>
                <li><code>operations(...updateExpressions)</code></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><code>add(...values)</code> - Add a numerical value to the numerical attribute or values to the set attribute</li>
                <li><code>increment()</code> - Increment the numerical attribute by 1</li>
                <li><code>incrementBy(value)</code> - Increment the numerical attribute by a value</li>
                <li><code>decrement()</code> - Decrement the numerical attribute by 1</li>
                <li><code>decrementBy(value)</code> - Decrement the numerical attribute by a value</li>
                <li><code>appendToStartOfList(...values)</code> - Append values to the start of the list attribute</li>
                <li><code>appendToEndOfList(...values)</code> - Append values to the end of the list attribute</li>
                <li><code>set(value, ifNotExists = false)</code> - Set the value of the attribute (optional only set the value if the attribute doesn't exist)</li>
                <li><code>remove()</code> - Remove the attribute</li>
                <li><code>removeFromListAt(...indices)</code> - Remove elements from the list attribute at the specific indices</li>
                <li><code>removeFromSet(...values)</code> - Remove values from the set attribute</li>
            </ul>
        </td>
    </tr>
</table>

## Logical Operators

Logical operators are used to extend the logic of condition expressions, filter expressions and key condition expressions.

<table>
    <tr>
        <th>Operator</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>not(conditionExpression)</code></td>
        <td>The condition expression must evaluate to <code>false</code> for the result to be <code>true</code></td>
    </tr>
    <tr>
        <td><code>and(...conditionExpressions)</code></td>
        <td>All condition expressions must evaluate to <code>true</code> for the result to be <code>true</code></td>
    </tr>
    <tr>
        <td><code>or(...conditionExpressions)</code></td>
        <td>Only one condition expression must evaluate to <code>true</code> for the result to be <code>true</code></td>
    </tr>
</table>

## Executing Requests

Once a request has been created, it can be executed and the return values can be used.

<table>
    <tr>
        <th>Request Type</th>
        <th>Inheriting Types</th>
        <th>Methods</th>
    </tr>
    <tr>
        <td><code>BaseRequest</code></td>
        <td>All</td>
        <td><code>execFullResponse()</code> - Execute and return the full response</td>
    </tr>
    <tr>
        <td><code>ReadManyRequest</code></td>
        <td>
            <code>QueryRequest</code>, <code>ScanRequest</code>
        </td>
        <td>
            <ul>
                <li><code>exec()</code> - Execute and return requested items</li>
                <li><code>execCount()</code> - Execute and return the count of the number of items found</li>
                <li><code>execSingle()</code> - Execute and return a single item</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><code>WriteRequest</code></td>
        <td><code>DeleteRequest</code>, <code>PutRequest</code>, <code>UpdateRequest</code></td>
        <td><code>exec()</code> - Execute and return requested attributes</td>
    </tr>
    <tr>
        <td><code>GetRequest</code></td>
        <td>None</td>
        <td><code>exec()</code> - Execute and return the requested item</td>
    </tr>
</table>