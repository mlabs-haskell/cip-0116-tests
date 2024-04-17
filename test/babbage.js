import * as assert from 'assert';
import { checkRefs, schema, mkValidatorForType, ajv } from '../index.js';

describe('Babbage schema', function () {
  it('Schema is valid according to meta-schema', function () {
    const valid = ajv.validateSchema(schema);
    assert.equal(valid, true);
    assert.equal(ajv.errors, null);
  });

  it('`$ref`s are pointing to existing definitions', function () {
    checkRefs(schema);
  });

  describe('Address', function () {
    const validate = mkValidatorForType('Address');

    const addresses = [
      '37btjrVyb4KDXBNC4haBVPCrro8AQPHwvCMp3RFhhSVWwfFmZ6wwzSK6JK1hY6wHNmtrpTf1kdbva8TCneM2YsiXT7mrzT21EacHnPpz5YyUdj64na',
      'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
    ];

    for (const address of addresses) {
      it(address, function () {
        assert.equal(validate(address), true);
      });
    }
  });

  describe('ByteString', function () {
    const validate = mkValidatorForType('ByteString');
    it('is case-sensitive', function () {
      assert.equal(
        validate('aa'), true
      );
      assert.equal(
        validate('aA'), false
      );
    });
    it('can be empty', function () {
      assert.equal(
        validate(''), true
      );
    });
    it('must have even length', function () {
      assert.equal(
        validate('aaa'), false
      );
      assert.equal(
        validate('a'), false
      );
    });
  });

  describe('Ipv6', function () {
    const validate = mkValidatorForType('Ipv6');
    it('example #1', function () {
      assert.equal(
        validate('0:0:0:0:0:0:0:0'), true
      );
    });
  });
});
