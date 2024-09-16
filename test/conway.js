import * as assert from 'assert';
import { checkRefs, schemas, mkValidatorForType as mkValidatorForType_, ajv } from '../index.js';

const schema = schemas.conway;

const mkValidatorForType = (type) => mkValidatorForType_('conway', type);

describe('Conway schema', function () {
  it('Schema is valid according to meta-schema', function () {
    const valid = ajv.validateSchema(schema);
    assert.equal(ajv.errors, null);
    assert.equal(valid, true);
  });
});
