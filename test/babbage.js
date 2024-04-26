import * as assert from 'assert';
import { checkRefs, schema, mkValidatorForType, ajv } from '../index.js';

function assertions (type, fixtures, negFixtures) {
  const validate = mkValidatorForType(type);

  for (const fixture of fixtures) {
    it(JSON.stringify(fixture), function () {
      assert.equal(validate(fixture), true);
    });
  }

  for (const fixture of negFixtures) {
    it(JSON.stringify(fixture), function () {
      assert.equal(validate(fixture), false);
    });
  }
}

const protocolParamUpdateFixture1 = {
  "ada_per_utxo_byte": '64',
  "collateral_percentage": 32,
  "cost_models":       {
    plutus_v1: new Array(166).fill('123'),
    plutus_v2: new Array(175).fill('123')
  },
  "d": {
    numerator: '123',
    denominator: '345'
  },
  "execution_costs": {
    mem_price: {
      numerator: '123',
      denominator: '345'
    },
    step_price: {
      numerator: '123',
      denominator: '345'
    }
  },
  "expansion_rate": {
    numerator: '123',
    denominator: '345'
  },
  "key_deposit": '64',
  "max_block_body_size": 32,
  "max_block_ex_units": { mem: '123', steps: '456' },
  "max_block_header_size": 32,
  "max_collateral_inputs": 32,
  "max_epoch": 32,
  "max_tx_ex_units": { mem: '123', steps: '456' },
  "max_tx_size": 32,
  "max_value_size": 32,
  "min_pool_cost": '64',
  "minfee_a": '64',
  "minfee_b": '64',
  "n_opt": '123467',
  "pool_deposit": '64',
  "pool_pledge_influence": {
    numerator: '123',
    denominator: '345'
  },
  "protocol_version": {
    major: 1,
    minor: 2
  },
  "treasury_growth_rate": {
    numerator: '123',
    denominator: '345'
  }
};

const updateFixture1 = {
  epoch: 1234,
  proposed_protocol_parameter_updates: {
    "00000000000000000000000000000000000000000000000000000000": protocolParamUpdateFixture1
  }
};

const transactionBodyFixture1 = {
  "auxiliary_data_hash": '0000000000000000000000000000000000000000000000000000000000000000',
  "inputs": [
    {
      transaction_id: '0000000000000000000000000000000000000000000000000000000000000000',
      index: 0
    }
  ],
  "outputs": [
    {
      address: 'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
      amount: { coin: '0' }
    },
    {
      address: 'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
      amount: { coin: '0' },
      plutus_data: {
        tag: 'datum',
        value: {
          tag: 'list',
          contents: []
        }
      }
    },
    {
      address: 'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
      amount: { coin: '0' },
      plutus_data: {
        tag: 'datum_hash',
        value: '0000000000000000000000000000000000000000000000000000000000000000'
      }
    },
    {
      address: 'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
      amount: { coin: '0' },
      script_ref: {
        tag: 'plutus_script',
        value: {
          language: 'plutus_v1',
          bytes: '1234'
        }
      },
    },
  ],
  "fee": '123',
  "certs": [
    {
      tag: 'stake_registration',
      credential: { tag: 'pubkey_hash', value: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361' }
    }
  ],
  "collateral": [],
  "collateral_return": {
    address: 'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
    amount: { coin: '123' }
  },
  "mint": [
    {
      script_hash: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361',
      assets: [
        {
          asset_name: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361',
          amount: '1234'
        }
      ]
    }
  ],
  "network_id": 'mainnet',
  "reference_inputs": [],
  "required_signers": [
    '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
  ],
  "script_data_hash": '0000000000000000000000000000000000000000000000000000000000000000',
  "total_collateral": '123',
  "ttl": '12345',
  "update": updateFixture1,
  "validity_start_interval": '123456',
  "withdrawals": [
    {
      key: 'stake1u87qlejzjkrxm9ja7k6h0x7xuepd3q8njesv2s62lz83ttszp4x0y',
      value: '12345'
    }
  ]
};

describe('Babbage schema', function () {
  it('Schema is valid according to meta-schema', function () {
    const valid = ajv.validateSchema(schema);
    assert.equal(valid, true);
    assert.equal(ajv.errors, null);
  });

  it('`$ref`s are pointing to existing definitions', function () {
    checkRefs(schema);
  });

  describe('BigInt', function () {
    const fixtures = [
      '0',
      '9',
      '-1234',
      '-123412341234123412341234123412341234123412341234123412341234',
      '123412341234123412341234123412341234123412341234123412341234',
    ];

    const negFixtures = [
      '09',
      '-0',
      '-09',
    ];
    assertions('BigInt', fixtures, negFixtures);
  });


  describe('ByteString', function () {
    const validate = mkValidatorForType('ByteString');

    const fixtures = [
      '00',
      '',
      'aa',
      'afafaf',
    ];

    const negFixtures = [
      '0A',
      'AA',
      'AFA',
      'a',
      'a0a',
    ];

    assertions('ByteString', fixtures, negFixtures);
  });

  describe('UInt64', function () {
    const fixtures = [
      '0',
      '123',
      '18446744073709551615'
    ];

    const negFixtures = [
      '',
      '-1',
      '01',
      '18446744073709551616'
    ];

    assertions('UInt64', fixtures, negFixtures);
  });

  describe('PosInt64', function () {
    const fixtures = [
      '123',
      '18446744073709551615',
    ];

    const negFixtures = [
      '',
      '0',
      '-1',
      '01',
      '18446744073709551616'
    ];

    assertions('PosInt64', fixtures, negFixtures);
  });

  describe('Int128', function () {
    const fixtures = [
      '123',
      '18446744073709551615',
      '-123',
      '-18446744073709551615',
    ];

    const negFixtures = [
      '',
      '01',
      '-01',
    ];
    assertions('Int128', fixtures, negFixtures);
  });

  describe('Ed25519KeyHash', function () {
    const fixtures = [
      '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361',
    ];

    const negFixtures = [
      '',
      '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d533'
    ];
    assertions('Ed25519KeyHash', fixtures, negFixtures);
  });

  describe('ScriptHash', function () {
    const fixtures = [
      '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361',
    ];

    const negFixtures = [
      '',
      '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d533'
    ];
    assertions('ScriptHash', fixtures, negFixtures);
  });

  describe('AssetName', function () {
    const validate = mkValidatorForType('AssetName');

    const fixtures = [
      '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361',
      '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d533',
      ''
    ];

    const negFixtures = [
      'AA',
    ];

    assertions('AssetName', fixtures, negFixtures);
  });

  describe('Credential', function () {
    const fixtures = [
      { tag: 'pubkey_hash', value: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361' },
      { tag: 'script_hash', value: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361' },
    ];

    const negFixtures = [
      { value: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361' },
    ];

    assertions('Credential', fixtures, negFixtures);
  });

  describe('MultiAsset', function () {
    const fixtures = [
      { '00000000000000000000000000000000000000000000000000000000': { '00': '1' } },
      { '00000000000000000000000000000000000000000000000000000000': { '00000000000000000000000000000000': '1' } },
    ];

    const negFixtures = [
      { '000000000000000000000000000000000000000000000000000000': { '00': '1' } },
      { '00000000000000000000000000000000000000000000000000000000': { '00': '0' } },
      { '00000000000000000000000000000000000000000000000000000000': { '00': '-1' } },
      { '00000000000000000000000000000000000000000000000000000000': { 'ascii': '1' } },
      { '00000000000000000000000000000000000000000000000000000000': { '000000000000000000000000000000000000000000000000000000000000000011': '1' } },
    ];

    assertions('MultiAsset', fixtures, negFixtures);
  });

  describe('TransactionHash', function () {
    const fixtures = [
      '0000000000000000000000000000000000000000000000000000000000000000'
    ];

    const negFixtures = [
      '00000000000000000000000000000000000000000000000000000000000000'
    ];

    assertions('TransactionHash', fixtures, negFixtures);
  });

  describe('TransactionInput', function () {
    const fixtures = [
      {
        transaction_id: '0000000000000000000000000000000000000000000000000000000000000000',
        index: 0
      }
    ];

    const negFixtures = [
    ];

    assertions('TransactionInput', fixtures, negFixtures);
  });

  describe('PlutusScript', function () {
    const fixtures = [
      {
        bytes: '0000000000000000000000000000000000000000000000000000000000000000',
        language: 'plutus_v1'
      },
      {
        bytes: '0000000000000000000000000000000000000000000000000000000000000000',
        language: 'plutus_v2'
      }
    ];

    const negFixtures = [
    ];

    assertions('PlutusScript', fixtures, negFixtures);
  });

  describe('NativeScript', function () {
    const fixtures = [
      {
        tag: 'pubkey',
        pubkey: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
      },
      {
        tag: 'all',
        scripts: [
          {
            tag: 'pubkey',
            pubkey: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
          }
        ]
      },
      {
        tag: 'any',
        scripts: [
          {
            tag: 'pubkey',
            pubkey: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
          }
        ]
      },
      {
        tag: 'n_of_k',
        scripts: [
          {
            tag: 'pubkey',
            pubkey: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
          }
        ],
        n: 1
      },
      {
        tag: 'timelock_start',
        slot: '12345'
      },
      {
        tag: 'timelock_expiry',
        slot: '12345'
      },
    ];

    const negFixtures = [
      { tag: 'pubkey', 'pubkey': '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d533' }
    ];

    assertions('NativeScript', fixtures, negFixtures);
  });

  describe('ScriptRef', function () {
    const fixtures = [
      {
        tag: 'plutus_script',
        value: {
          language: 'plutus_v1',
          bytes: '1234'
        }
      },
      {
        tag: 'native_script',
        value: {
          tag: 'all',
          scripts: []
        }
      },
    ];

    const negFixtures = [
    ];

    assertions('ScriptRef', fixtures, negFixtures);
  });

  describe('DataHash', function () {
    const fixtures = [
      '0000000000000000000000000000000000000000000000000000000000000000'
    ];

    const negFixtures = [
    ];

    assertions('DataHash', fixtures, negFixtures);
  });

  describe('TransactionOutput', function () {
    const fixtures = [
      {
        address: 'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
        amount: { coin: '0' }
      },
      {
        address: 'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
        amount: { coin: '0' },
        plutus_data: {
          tag: 'datum',
          value: {
            tag: 'list',
            contents: []
          }
        }
      },
      {
        address: 'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
        amount: { coin: '0' },
        plutus_data: {
          tag: 'datum_hash',
          value: '0000000000000000000000000000000000000000000000000000000000000000'
        }
      },
      {
        address: 'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
        amount: { coin: '0' },
        script_ref: {
          tag: 'plutus_script',
          value: {
            language: 'plutus_v1',
            bytes: '1234'
          }
        },
      },
    ];

    const negFixtures = [
    ];

    assertions('TransactionOutput', fixtures, negFixtures);
  });

  describe('TransactionUnspentOutput', function () {
    const fixtures = [
      {
        input: {
          transaction_id: '0000000000000000000000000000000000000000000000000000000000000000',
          index: 0
        },
        output: {
          address: 'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
          amount: { coin: '0' }
        },
      }
    ];

    const negFixtures = [
    ];

    assertions('TransactionUnspentOutput', fixtures, negFixtures);
  });

  describe('TransactionMetadatum', function () {
    const fixtures = [
      {
        tag: 'map',
        contents: [
          {
            key: {
              tag: 'int',
              value: '123'
            },
            value: {
              tag: 'int',
              value: '123'
            }
          }
        ]
      },

      {
        tag: 'list',
        contents: [
          {
            tag: 'int',
            value: '123'
          },
          {
            tag: 'int',
            value: '123'
          }
        ]
      },

      {
        tag: 'int',
        value: '123'
      },

      {
        tag: 'bytes',
        value: '1234'
      },

      {
        tag: 'bytes',
        value: ''
      },

      {
        tag: 'string',
        value: 'asdasd'
      },

    ];

    const negFixtures = [

      {
        tag: 'bytes',
        value: '00112233445566778800112233445566778800112233445566778800112233445566778800112233445566778800112233445566778800112233445566778800112233445566778800'
      },

      {
        tag: 'string',
        value: '01020304010203040102030401020304010203040102030401020304010203040' // 65 bytes
      },
    ];

    assertions('TransactionMetadatum', fixtures, negFixtures);
  });

  describe('PlutusV1CostModel', function () {
    const fixtures = [
      new Array(166).fill('123')
    ];

    const negFixtures = [
      new Array(165).fill('123')
    ];

    assertions('PlutusV1CostModel', fixtures, negFixtures);
  });

  describe('PlutusV2CostModel', function () {
    const fixtures = [
      new Array(175).fill('123')
    ];

    const negFixtures = [
      new Array(174).fill('123')
    ];

    assertions('PlutusV2CostModel', fixtures, negFixtures);
  });

  describe('CostModels', function () {
    const fixtures = [
      {
        plutus_v1: new Array(166).fill('123'),
        plutus_v2: new Array(175).fill('123')
      }
    ];

    const negFixtures = [
    ];

    assertions('CostModels', fixtures, negFixtures);
  });

  describe('ExUnitPrices', function () {
    const fixtures = [
      {
        mem_price: {
          numerator: '123',
          denominator: '345'
        },
        step_price: {
          numerator: '123',
          denominator: '345'
        }
      }
    ];

    const negFixtures = [
    ];

    assertions('ExUnitPrices', fixtures, negFixtures);
  });

  describe('ExUnits', function () {
    const fixtures = [
      {
        mem: '123',
        steps: '456'
      }
    ];

    const negFixtures = [
    ];

    assertions('ExUnits', fixtures, negFixtures);
  });

  describe('ProtocolVersion', function () {
    const fixtures = [
      {
        major: 1,
        minor: 2
      }
    ];

    const negFixtures = [
    ];

    assertions('ProtocolVersion', fixtures, negFixtures);
  });

  describe('ProtocolParamUpdate', function () {
    const fixtures = [
      protocolParamUpdateFixture1
    ];

    const negFixtures = [
    ];

    assertions('ProtocolParamUpdate', fixtures, negFixtures);
  });

  describe('Update', function () {
    const fixtures = [
      updateFixture1
    ];

    const negFixtures = [
      {
        epoch: 1234,
        proposed_protocol_parameter_updates: {
          // wrong key length
          "000000000000000000000000000000000000000000000000000000": {
            "ada_per_utxo_byte": '64',
            "collateral_percentage": 32,
            "cost_models":       {
              plutus_v1: new Array(166).fill('123'),
              plutus_v2: new Array(175).fill('123')
            },
            "d": {
              numerator: '123',
              denominator: '345'
            },
            "execution_costs": {
              mem_price: {
                numerator: '123',
                denominator: '345'
              },
              step_price: {
                numerator: '123',
                denominator: '345'
              }
            },
            "expansion_rate": {
              numerator: '123',
              denominator: '345'
            },
            "key_deposit": '64',
            "max_block_body_size": 32,
            "max_block_ex_units": { mem: '123', steps: '456' },
            "max_block_header_size": 32,
            "max_collateral_inputs": 32,
            "max_epoch": 32,
            "max_tx_ex_units": { mem: '123', steps: '456' },
            "max_tx_size": 32,
            "max_value_size": 32,
            "min_pool_cost": '64',
            "minfee_a": '64',
            "minfee_b": '64',
            "n_opt": '123467',
            "pool_deposit": '64',
            "pool_pledge_influence": {
              numerator: '123',
              denominator: '345'
            },
            "protocol_version": {
              major: 1,
              minor: 2
            },
            "treasury_growth_rate": {
              numerator: '123',
              denominator: '345'
            }
          }
        }
      }
    ];

    assertions('Update', fixtures, negFixtures);
  });

  describe('AuxiliaryDataHash', function () {
    const fixtures = [
      '0000000000000000000000000000000000000000000000000000000000000000'
    ];

    const negFixtures = [
    ];

    assertions('AuxiliaryDataHash', fixtures, negFixtures);
  });

  describe('AuxiliaryData', function () {
    const fixtures = [
      {
        metadata: [
          {
            key: '123',
            value: { tag: 'list', contents: [] }
          }
        ],
        native_scripts: [
          {
            tag: 'pubkey',
            pubkey: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
          },
          {
            tag: 'all',
            scripts: [
              {
                tag: 'pubkey',
                pubkey: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
              }
            ]
          },
        ],
        plutus_scripts: [
          {
            language: 'plutus_v1',
            bytes: '0101'
          }
        ]
      }
    ];

    const negFixtures = [
    ];

    assertions('AuxiliaryData', fixtures, negFixtures);
  });

  describe('Relay', function () {
    const fixtures = [
      {
        tag: 'single_host_addr',
        port: 65535,
        ipv4: '127.0.0.1',
        ipv6: '0:0:0:0:0:0:0:0'
      },
      {
        tag: 'single_host_name',
        port: 65535,
        dns_name: 'example.com'
      },
      {
        tag: 'multi_host_name',
        dns_name: 'example.com'
      }
    ];

    const negFixtures = [
      {
        tag: 'single_host_name',
        port: 1234,
        // too long
        dns_name: '1234567890123456789012345678901234567890123456789012345678901.com'
      },
      {
        tag: 'multi_host_name',
        // too long
        dns_name: '1234567890123456789012345678901234567890123456789012345678901.com'
      }
    ];

    assertions('Relay', fixtures, negFixtures);
  });

  describe('PoolPubKeyHash', function () {
    const fixtures = [
      'pool1u6kpt8hgqcm596kukj97ghefmxn8ks2cgwg8qqe0gtgscnufk5p'
    ];

    const negFixtures = [
    ];

    assertions('PoolPubKeyHash', fixtures, negFixtures);
  });

  describe('VRFKeyHash', function () {
    const fixtures = [
      'vrf_vkh1l0mdgxv9vu9eqsw9humzk5nzeu62m4wjvkt4mctk6cfu5p0nwztqk8js79'
    ];

    const negFixtures = [
    ];

    assertions('VRFKeyHash', fixtures, negFixtures);
  });

  describe('PoolParams', function () {
    const fixtures = [
      {
        "operator": 'pool1u6kpt8hgqcm596kukj97ghefmxn8ks2cgwg8qqe0gtgscnufk5p',
        "vrf_keyhash": 'vrf_vkh1l0mdgxv9vu9eqsw9humzk5nzeu62m4wjvkt4mctk6cfu5p0nwztqk8js79',
        "pledge": '123',
        "cost": '123',
        "margin": {
          numerator: '123',
          denominator: '345'
        },
        "reward_account": 'stake1u87qlejzjkrxm9ja7k6h0x7xuepd3q8njesv2s62lz83ttszp4x0y',
        "pool_owners": [
          '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
        ],
        "relays": [
          {
            tag: 'single_host_addr',
            port: 65535,
            ipv4: '127.0.0.1',
            ipv6: '0:0:0:0:0:0:0:0'
          },
          {
            tag: 'single_host_name',
            port: 65535,
            dns_name: 'example.com'
          },
          {
            tag: 'multi_host_name',
            dns_name: 'example.com'
          }
        ],
        "pool_metadata": {
          url: "https://example.com/foo.json",
          hash: '0000000000000000000000000000000000000000000000000000000000000000'
        }
      }
    ];

    const negFixtures = [
    ];

    assertions('PoolParams', fixtures, negFixtures);
  });

  describe('Mint', function () {
    const fixtures = [
      [
        {
          script_hash: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361',
          assets: [
            {
              asset_name: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361',
              amount: '1234'
            }
          ]
        }
      ]
    ];

    const negFixtures = [
      [
        {
          script_hash: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361',
          assets: [
            {
              asset_name: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361',
              amount: '0'
            }
          ]
        }
      ]
    ];

    assertions('Mint', fixtures, negFixtures);
  });

  describe('Certificate', function () {
    const fixtures = [
      {
        tag: 'stake_registration',
        credential: { tag: 'pubkey_hash', value: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361' }
      },
      {
        tag: 'stake_deregistration',
        credential: { tag: 'pubkey_hash', value: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361' }
      },
      {
        tag: 'stake_delegation',
        credential: { tag: 'pubkey_hash', value: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361' },
        pool_keyhash: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
      },
      {
        tag: 'pool_registration',
        pool_params:       {
          "operator": 'pool1u6kpt8hgqcm596kukj97ghefmxn8ks2cgwg8qqe0gtgscnufk5p',
          "vrf_keyhash": 'vrf_vkh1l0mdgxv9vu9eqsw9humzk5nzeu62m4wjvkt4mctk6cfu5p0nwztqk8js79',
          "pledge": '123',
          "cost": '123',
          "margin": {
            numerator: '123',
            denominator: '345'
          },
          "reward_account": 'stake1u87qlejzjkrxm9ja7k6h0x7xuepd3q8njesv2s62lz83ttszp4x0y',
          "pool_owners": [
            '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
          ],
          "relays": [
            {
              tag: 'single_host_addr',
              port: 65535,
              ipv4: '127.0.0.1',
              ipv6: '0:0:0:0:0:0:0:0'
            },
            {
              tag: 'single_host_name',
              port: 65535,
              dns_name: 'example.com'
            },
            {
              tag: 'multi_host_name',
              dns_name: 'example.com'
            }
          ],
          "pool_metadata": {
            url: "https://example.com/foo.json",
            hash: '0000000000000000000000000000000000000000000000000000000000000000'
          }
        }
      },
      {
        tag: 'pool_retirement',
        pool_keyhash: 'pool1u6kpt8hgqcm596kukj97ghefmxn8ks2cgwg8qqe0gtgscnufk5p',
        epoch: 12345
      },
      {
        tag: 'genesis_key_delegation',
        genesis_hash: '00000000000000000000000000000000000000000000000000000000',
        genesis_delegate_hash: '00000000000000000000000000000000000000000000000000000000',
        vrf_keyhash: 'vrf_vkh1l0mdgxv9vu9eqsw9humzk5nzeu62m4wjvkt4mctk6cfu5p0nwztqk8js79',
      }
    ];

    const negFixtures = [
    ];

    assertions('Certificate', fixtures, negFixtures);
  });

  describe('TransactionBody', function () {
    const fixtures = [
      transactionBodyFixture1
    ];

    const negFixtures = [
    ];

    assertions('TransactionBody', fixtures, negFixtures);
  });

  describe('Ed25519PublicKey', function () {
    const fixtures = [
      '0000000000000000000000000000000000000000000000000000000000000000'
    ];

    const negFixtures = [
      '000000000000000000000000000000000000000000000000000000000000000'
    ];

    assertions('Ed25519PublicKey', fixtures, negFixtures);
  });

  describe('Ed25519Signature', function () {
    const fixtures = [
      '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    ];

    const negFixtures = [
      '000000000000000000000000000000000000000000000000000000000000000'
    ];

    assertions('Ed25519Signature', fixtures, negFixtures);
  });

  describe('BootstrapWitness', function () {
    const fixtures = [
      {
        attributes: '',
        chain_code: '0000000000000000000000000000000000000000000000000000000000000000',
        signature: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        vkey: '0000000000000000000000000000000000000000000000000000000000000000'
      },
      {
        attributes: '0101',
        chain_code: '0000000000000000000000000000000000000000000000000000000000000000',
        signature: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        vkey: '0000000000000000000000000000000000000000000000000000000000000000'
      }
    ];

    const negFixtures = [
    ];

    assertions('BootstrapWitness', fixtures, negFixtures);
  });

  describe('PlutusData', function () {
    const fixtures = [
      {
        tag: 'list',
        contents: [
          {
            tag: 'list',
            contents: []
          }
        ]
      },
      {
        tag: 'constr',
        alternative: '0',
        data: []
      },
      {
        tag: 'map',
        contents: [
          {
            key: {
              tag: 'list',
              contents: []
            },
            value: {
              tag: 'list',
              contents: []
            }
          }
        ]
      },
      {
        tag: 'integer',
        value: '12345'
      },
      {
        tag: 'bytes',
        value: '00'
      }
    ];

    const negFixtures = [
    ];

    assertions('PlutusData', fixtures, negFixtures);
  });

  describe('Redeemer', function () {
    const fixtures = [
      {
        data: {
          tag: 'bytes',
          value: '00'
        },
        tag: 'mint',
        index: '0',
        ex_units: {
          mem: '10',
          steps: '10',
        }
      }
    ];

    const negFixtures = [
    ];

    assertions('Redeemer', fixtures, negFixtures);
  });


  describe('TransactionWitnessSet', function () {
    const fixtures = [
      {
        bootstraps: [
          {
            attributes: '',
            chain_code: '0000000000000000000000000000000000000000000000000000000000000000',
            signature: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            vkey: '0000000000000000000000000000000000000000000000000000000000000000'
          },
        ],
        native_scripts: [
          {
            tag: 'all',
            scripts: [
              {
                tag: 'pubkey',
                pubkey: '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
              }
            ]
          }
        ],
        plutus_data: [
          {
            tag: 'list',
            contents: []
          }
        ],
        plutus_scripts: [
          {
            bytes: '0000000000000000000000000000000000000000000000000000000000000000',
            language: 'plutus_v1'
          }
        ],
        redeemers: [
          {
            data: {
              tag: 'bytes',
              value: '00'
            },
            tag: 'mint',
            index: '0',
            ex_units: {
              mem: '10',
              steps: '10',
            }
          }
        ],
        vkeywitnesses: [
          {
            vkey: '0000000000000000000000000000000000000000000000000000000000000000',
            signature: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          }
        ]
      }
    ];

    const negFixtures = [
    ];

    assertions('TransactionWitnessSet', fixtures, negFixtures);
  });

  describe('ScriptDataHash', function () {
    const fixtures = [
      '0000000000000000000000000000000000000000000000000000000000000000'
    ];

    const negFixtures = [
    ];

    assertions('ScriptDataHash', fixtures, negFixtures);
  });

  describe('TransactionMetadata', function () {
    const fixtures = [
      [
        {
          key: '123',
          value: { tag: 'list', contents: [] }
        }
      ]
    ];

    const negFixtures = [
    ];

    assertions('TransactionMetadata', fixtures, negFixtures);
  });

  describe('Value', function () {
    const fixtures = [
      { coin: '0' },
      { coin: '1' },
      { coin: '0', assets: { '00000000000000000000000000000000000000000000000000000000': { '00': '1' } } },
      { coin: '0', assets: { '00000000000000000000000000000000000000000000000000000000': { '00000000000000000000000000000000': '1' } } },
      { coin: '0', assets: { '00000000000000000000000000000000000000000000000000000000': { '0000000000000000000000000000aaff': '1' } } },
      { coin: '0', assets: { '00000000000000000000000000000000000000000000000000000000': { '0000000000000000000000000000000000000000000000000000000000000000': '1' } } },
      { coin: '0', assets: { '00000000000000000000000000000000000000000000000000000000': { '': '1' } } },
    ];

    const negFixtures = [
      { coin: '-1' },
      { },
      { coin: '0', assets: { '000000000000000000000000000000000000000000000000000000': { '00': '1' } } },
      { coin: '0', assets: { '00000000000000000000000000000000000000000000000000000000': { '00': '0' } } },
      { coin: '0', assets: { '00000000000000000000000000000000000000000000000000000000': { '00': '-1' } } },
      { coin: '0', assets: { '00000000000000000000000000000000000000000000000000000000': { 'ascii': '1' } } },
      { coin: '0', assets: { '00000000000000000000000000000000000000000000000000000000': { '000000000000000000000000000000000000000000000000000000000000000011': '1' } } },
    ];

    assertions('Value', fixtures, negFixtures);
  });

  describe('Address', function () {
    const fixtures = [
      '37btjrVyb4KDXBNC4haBVPCrro8AQPHwvCMp3RFhhSVWwfFmZ6wwzSK6JK1hY6wHNmtrpTf1kdbva8TCneM2YsiXT7mrzT21EacHnPpz5YyUdj64na',
      'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
    ];

    const negFixtures = [
      'addr1vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80',
      'addr2vpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5eg0yu80w',
    ];
    assertions('Address', fixtures, negFixtures);
  });

  describe('Ipv6', function () {
    const fixtures = [
      '0:0:0:0:0:0:0:0'
    ];

    const negFixtures = [
      '0:0:0:0:0:0:0'
    ];
    assertions('Ipv6', fixtures, negFixtures);
  });
});
