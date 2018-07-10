enyo.singleton(
{
	kind: 'enyo.Object',
	name: 'wxcafe.QRCodeTransformationHelperSingleton',

	_schemas: {
		memberApp: {
			prefix: 'MAQ',
			postfix: null,
			separator: '_',
			fields: ['storeID', 'customerID', 'countryCode', 'phoneNumber', 'timestamp'],
			fieldTransform: [
				{
					action: 'trimLeadingPlus',
					field: 'countryCode',
					encode: 0,
					decode: null
				},
				{
					action: 'trimLeadingZeros',
					field: 'phoneNumber',
					encode: 1,
					decode: null
				},
				{
					action: 'reverse',
					field: '*',
					encode: 2,
					decode: 1
				},
				{
					action: 'maskFields',
					field: '*',
					instructions: 
					{
						prefix: true,
						postfix: true,
						pattern: [2, 1],
						characterSet: 'numeric'
					},
					encode: 3,
					decode: 0
				}
			]
		}
	},

	/**
	 * Validates a QR code value based on the necessary prefix and/or postfix of the given schema.
	 */
	verifySchema: function(input, schema)
	{
		if (typeof input !== 'string' || input.length === 0 || typeof schema !== 'string' || !this._schemas.hasOwnProperty(schema))
		{
			enyo.error('Invalid argument(s) passed to verifySchema(). Should be string, string. The schema name also must be valid.', arguments);
			return false;
		}

		var schemaDefinition = this._schemas[schema];

		if (schemaDefinition.hasOwnProperty('prefix') && schemaDefinition.prefix)
		{
			if (input.indexOf(schemaDefinition.prefix) !== 0)
			{
				return false; // Failed prefix expectation
			}
		}

		if (schemaDefinition.hasOwnProperty('postfix') && schemaDefinition.postfix)
		{
			if (input.indexOf(schemaDefinition.postfix) === -1)
			{
				return false; // Failed postfix expectation
			}
		}

		return true;
	},

	/**
	 * Encodes an object into a QR code value based on the given schema.
	 */
	encode: function(input, schema)
	{
		var output = '';

		if (typeof input !== 'object' || typeof schema !== 'string' || !this._schemas.hasOwnProperty(schema))
		{
			enyo.error('Invalid argument(s) passed to encode(). Should be object, string. The schema name also must be valid.', arguments);
			return false;
		}

		return output;
	},

	/**
	 * Decodes an QR code value into an object based on the given schema.
	 */
	decode: function(input, schema)
	{
		var output = {};

		if (typeof input !== 'string' || input.length === 0 || typeof schema !== 'string' || !this._schemas.hasOwnProperty(schema))
		{
			enyo.error('Invalid argument(s) passed to decode(). Should be string, string. The schema name also must be valid.', arguments);
			return false;
		}

		var schemaDefinition = this._schemas[schema];
		var trimmedInput = input;

		// Remove prefix (if applicable)
		if (schemaDefinition.hasOwnProperty('prefix') && schemaDefinition.prefix)
		{
			if (trimmedInput.indexOf(schemaDefinition.prefix) !== 0)
			{
				enyo.warn('input is missing the expected prefix: ', schemaDefinition.prefix, input);
			}
			else
			{
				trimmedInput = trimmedInput.substring(schemaDefinition.prefix.length + 1);
			}
		}

		// Remove postfix (if applicable)
		if (schemaDefinition.hasOwnProperty('postfix') && schemaDefinition.postfix)
		{
			var positionOfPostfix = trimmedInput.indexOf(schemaDefinition.postfix);

			if (positionOfPostfix !== (trimmedInput.length - schemaDefinition.postfix.length))
			{
				enyo.warn('input is missing the expected postfix:', schemaDefinition.postfix, input);
			}
			else
			{
				trimmedInput = trimmedInput.substring(0, trimmedInput.length - schemaDefinition.postfix.length - 1);
			}
		}

		// Split string using separator
		var decodedInputTokens = trimmedInput.split(schemaDefinition.separator);
		var outputTokenCount = 0;

		for (var a = 0; a < decodedInputTokens.length && a <= schemaDefinition.fields.length; a++)
		{
			output[schemaDefinition.fields[a]] = decodedInputTokens[a];
			outputTokenCount++;
		}

		// Map the transformation order for decoding
		var mappedTransformOrder = schemaDefinition.fieldTransform.map(function(value, index, array)
		{
			return value.decode;
		});

		var transformOperations = [];

		// Set up the transformations to perform, in the specified order
		for (var b = 0; b < mappedTransformOrder.length; b++)
		{
			if (mappedTransformOrder[b] !== null) continue;

			transformOperations.push(schemaDefinition.fieldTransform[mappedTransformOrder.indexOf(b)]);
		}

		for (var c = 0; c < transformOperations.length; c++)
		{
			var op = transformOperations[c];

			var fieldsToTransform = [];

			if (op.field === '*')
			{
				for (var i = 0; i < outputTokenCount; i++)
				{
					fieldsToTransform.push(i);
				}
			}
			else
			{
				fieldsToTransform.push(schemaDefinition.fields.indexOf(op.field));
			}

			var fieldName, field, fieldValue;

			if (op.action === 'maskFields')
			{
				for (var d = 0; d < fieldsToTransform.length; d++)
				{
					fieldName = schemaDefinition.fields[fieldsToTransform[d]];
					field = output[fieldName];
					fieldValue = '';
					var patternPosition = 0;

					if (op.instructions.prefix === true)
					{
						field = field.substring(op.instructions.pattern[patternPosition]);
						fieldValue += field.substr(0, 1);
						field = field.substring(1);

						patternPosition = (++patternPosition >= op.instructions.pattern.length) ? 0 : patternPosition;
					}

					do {
						field = field.substring(op.instructions.pattern[patternPosition]);
						fieldValue += field.substr(0, 1);
						field = field.substring(1);

						patternPosition = (++patternPosition >= op.instructions.pattern.length) ? 0 : patternPosition;

					} while (field.length > op.instructions.pattern[patternPosition] + (op.instructions.postfix === true ? 1 : 0));

					output[fieldName] = fieldValue;
				}
			}

			if (op.action === 'reverse')
			{
				for (var e = 0; e < fieldsToTransform.length; e++)
				{
					fieldName = schemaDefinition.fields[fieldsToTransform[e]];
					field = output[fieldName];
					fieldValue = field.split('').reverse().join('');

					output[fieldName] = fieldValue;
				}
			}
		}

		return output;
	}
});

/*****************
 * WEB TEST CODE *

var prefix = true;
var postfix = true;
var pattern = [2,1];
var field = 'WH1O2OP3D4IE5D6';
var fieldValue = '';
var patternPosition = 0;

if (prefix === true)
{
	field = field.substring(pattern[patternPosition]);
	fieldValue += field.substr(0, 1);
	field = field.substring(1);

	patternPosition = (++patternPosition >= pattern.length) ? 0 : patternPosition;
	console.log({field: field, fieldValue: fieldValue});
}

do {
	field = field.substring(pattern[patternPosition]);
	fieldValue += field.substr(0, 1);
	field = field.substring(1);

	patternPosition = (++patternPosition >= pattern.length) ? 0 : patternPosition;
    console.log({field: field, fieldValue: fieldValue});
} while (field.length > pattern[patternPosition] + (postfix === true ? 1 : 0));
*/