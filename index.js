import * as fs from 'fs';
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import * as metaSchema from 'ajv/lib/refs/json-schema-2020-12/schema.json' assert {type: 'json'};
import { bech32 } from 'bech32';
import { base58_to_binary } from "base58-js";

export const ajv = new Ajv2020({
  strict: true,
  strictSchema: true,
  allErrors: true,
  validateSchema: true,
  meta: true,
});

addFormats(ajv);

ajv.addFormat('bech32', str => {
  try {
    return !!bech32.decode(str);
  } catch (_) {
    return false;
  }
});

ajv.addFormat('base58', str => {
  try {
    return !!base58_to_binary(str);
  } catch (_) {
    return false;
  }
});

ajv.addFormat('hex', str => {
  return /^([0-9a-f][0-9a-f])*$/.test(str);
});

export const schema = JSON.parse(
  fs.readFileSync('./CIPs/CIP-0116/cardano-babbage.json'));

ajv.addSchema(schema, 'cardano-babbage.json');
ajv.addMetaSchema(metaSchema, 'meta');

export const mkValidatorForType = (type) => {
  return ajv.getSchema('cardano-babbage.json#/definitions/' + type);
};

export const checkRefs = (json) => {
  const refs = new Set();

  const go = (json) => {
    if (typeof json == 'object') {
      for (let prop in json) {
        if (json.hasOwnProperty(prop)) {
          if (prop == "$ref") {
            refs.add(json[prop].split('/').pop());
          } else {
            go(json[prop]);
          }
        }
      }
    } else if (typeof json == 'array') {
      for (let item of json) {
        go(item);
      }
    }
  };

  go(json);
  const allowedProperties = new Set([
    'title',
    'description',
    'type',
    'pattern',
    'format',
    'oneOf',
    'anyOf',
    'required',
    'additionalProperties',
    'properties',
    'minimum',
    'maximum',
    'maxLength',
    'minLength',
    'discriminator',
    'enum',
    'patternProperties',
    'items',
    'examples'
  ]);

  Object.keys(schema.definitions).sort().forEach(key => {
    const value = schema.definitions[key];
    if (!Object.keys(value).every(x => allowedProperties.has(x))) {
      throw(
        'Disallowed property found in ' + key + ':' +
          (
            Object.keys(value).filter(x => !allowedProperties.has(x))
          ).join(', ')
      );
    }
    if (schema.definitions[key].title != key) {
      throw ('No title set for', key);
    }
  });

  for (const ref of refs.keys()) {
    if (typeof schema.definitions[ref] != 'object') {
      throw ('$ref not found: ', ref);
    }
  }
};
