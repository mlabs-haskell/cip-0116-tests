import * as fs from 'fs';
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import * as metaSchema from 'ajv/lib/refs/json-schema-2020-12/schema.json' assert {type: 'json'};
import { bech32 } from 'bech32';
import { base58_to_binary } from "base58-js";

export const eras = {
  'babbage': './CIPs/CIP-0116/cardano-babbage.json',
  'conway': './CIPs/CIP-0116/cardano-conway.json',
};

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
    return !!bech32.decode(str, 108 /* length limit */);
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

ajv.addFormat('uint16', str => {
  try {
    return BigInt(str) < BigInt(2) ** BigInt(16) && BigInt(str) >= BigInt(0);
  } catch (_) {
    return false;
  }
});

ajv.addFormat('uint64', str => {
  try {
    return BigInt(str) < BigInt(2) ** BigInt(64) && BigInt(str) >= BigInt(0);
  } catch (_) {
    return false;
  }
});

ajv.addFormat('int128', str => {
  try {
    return BigInt(str) < BigInt(2) ** BigInt(128) &&
      BigInt(str) > - (BigInt(2) ** BigInt(128));
  } catch (_) {
    return false;
  }
});

ajv.addFormat('string64', str => {
  try {
    return ((new TextEncoder()).encode(str)).length <= 64;
  } catch (_) {
    return false;
  }
});

ajv.addFormat('string128', str => {
  try {
    return ((new TextEncoder()).encode(str)).length <= 128;
  } catch (_) {
    return false;
  }
});

ajv.addFormat('posint64', str => {
  try {
    return BigInt(str) < BigInt(2) ** BigInt(64) && BigInt(str) > BigInt(0);
  } catch (_) {
    return false;
  }
});

ajv.addFormat('hex', str => {
  return /^([0-9a-f][0-9a-f])*$/.test(str);
});

export const schemas = {
  babbage: JSON.parse(fs.readFileSync(eras.babbage)),
  conway: JSON.parse(fs.readFileSync(eras.conway))
};

ajv.addSchema(schemas.babbage, 'cardano-babbage.json');
ajv.addSchema(schemas.conway, 'cardano-conway.json');
ajv.addMetaSchema(metaSchema, 'meta');

ajv.addKeyword({
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  code(cxt) {
    const {data, schema} = cxt;
    cxt.fail(Ajv2020._`typeof ${schema.propertyName} !== 'string'`);
    cxt.fail(Ajv2020._`!${data}.hasOwnProperty(${schema.propertyName})`);
  },
});

export const mkValidatorForType = (era, type) => {
  return ajv.getSchema('cardano-' + era + '.json#/definitions/' + type);
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
    'maxItems',
    'minItems',
    'examples'
  ]);

  Object.keys(json.definitions).sort().forEach(key => {
    const value = json.definitions[key];
    if (!Object.keys(value).every(x => allowedProperties.has(x))) {
      throw(
        'Disallowed property found in ' + key + ':' +
          (
            Object.keys(value).filter(x => !allowedProperties.has(x))
          ).join(', ')
      );
    }
    if (typeof json.definitions[key].title != 'string') {
      throw ('No title set for ' + key);
    }
    if (json.definitions[key].title != key) {
      throw (
        'Wrong title set for ' + key + ': ' +
          json.definitions[key].title + ', must be ' + key
      );
    }
  });

  for (const ref of refs.keys()) {
    if (typeof json.definitions[ref] != 'object') {
      throw ('$ref not found: ' + ref);
    }
  }
};
