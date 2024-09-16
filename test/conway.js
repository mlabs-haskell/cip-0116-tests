import * as assert from 'assert';
import { checkRefs, schemas, mkValidatorForType as mkValidatorForType_, ajv } from '../index.js';

const schema = schemas.conway;

const mkValidatorForType = (type) => mkValidatorForType_('conway', type);

function assertions (type, fixtures, negFixtures) {

  for (const fixture of fixtures) {
    const validate = mkValidatorForType(type);
    it(JSON.stringify(fixture), function () {
      validate(fixture);
      assert.equal(validate.errors, null);
    });
  }

  for (const fixture of negFixtures) {
    const validate = mkValidatorForType(type);
    it(JSON.stringify(fixture), function () {
      validate(fixture);
      assert.equal(validate.errors, null);
    });
  }
}

describe('Conway schema', function () {
  it('Schema is valid according to meta-schema', function () {
    const valid = ajv.validateSchema(schema);
    assert.equal(ajv.errors, null);
    assert.equal(valid, true);
  });

  it('`$ref`s are pointing to existing definitions', function () {
    checkRefs(schema);
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
        pool_keyhash: 'pool1u6kpt8hgqcm596kukj97ghefmxn8ks2cgwg8qqe0gtgscnufk5p',
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
      // removed in Conway
      // {
      //   tag: 'genesis_key_delegation',
      //   genesis_hash: '00000000000000000000000000000000000000000000000000000000',
      //   genesis_delegate_hash: '00000000000000000000000000000000000000000000000000000000',
      //   vrf_keyhash: 'vrf_vkh1l0mdgxv9vu9eqsw9humzk5nzeu62m4wjvkt4mctk6cfu5p0nwztqk8js79',
      // }
      {
        "tag": "stake_registration",
        "credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        }
      },
      {
        "tag": "stake_deregistration",
        "credential": {
          "tag": "script_hash",
          "value": "0d93bffbd38c1a5da47b6e93471f7e3c5ae52da6c12b687b11e2d3d1"
        }
      },
      {
        "tag": "stake_delegation",
        "credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "pool_keyhash": 'pool1u6kpt8hgqcm596kukj97ghefmxn8ks2cgwg8qqe0gtgscnufk5p',
      },
      {
        "tag": "pool_retirement",
        "pool_keyhash": 'pool1u6kpt8hgqcm596kukj97ghefmxn8ks2cgwg8qqe0gtgscnufk5p',
        "epoch": 300
      },
      {
        "tag": "registration",
        "credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "coin": "500000000"
      },
      {
        "tag": "unregistration",
        "credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "coin": "500000000"
      },
      {
        "tag": "vote_delegation",
        "credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "drep": {
          "tag": "key_hash",
          "key_hash": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        }
      },
      {
        "tag": "stake_vote_delegation",
        "credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "pool_keyhash": 'pool1u6kpt8hgqcm596kukj97ghefmxn8ks2cgwg8qqe0gtgscnufk5p',
        "drep": {
          "tag": "script_hash",
          "script_hash": "0d93bffbd38c1a5da47b6e93471f7e3c5ae52da6c12b687b11e2d3d1"
        }
      },
      {
        "tag": "stake_registration_delegation",
        "credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "pool_keyhash": 'pool1u6kpt8hgqcm596kukj97ghefmxn8ks2cgwg8qqe0gtgscnufk5p',
        "coin": "1000000"
      },
      {
        "tag": "vote_registration_delegation",
        "credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "pool_keyhash": 'pool1u6kpt8hgqcm596kukj97ghefmxn8ks2cgwg8qqe0gtgscnufk5p',
        "drep": {
          "tag": "key_hash",
          "key_hash": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "coin": "1000000"
      },
      {
        "tag": "stake_vote_registration_delegation",
        "credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "pool_keyhash": 'pool1u6kpt8hgqcm596kukj97ghefmxn8ks2cgwg8qqe0gtgscnufk5p',
        "drep": {
          "tag": "script_hash",
          "script_hash": "0d93bffbd38c1a5da47b6e93471f7e3c5ae52da6c12b687b11e2d3d1"
        },
        "coin": "1000000"
      },
      {
        "tag": "auth_committee_hot",
        "committee_cold_credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "committee_hot_credential": {
          "tag": "script_hash",
          "value": "0d93bffbd38c1a5da47b6e93471f7e3c5ae52da6c12b687b11e2d3d1"
        }
      },
      {
        "tag": "resign_committee_cold",
        "committee_cold_credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "anchor": {
          "url": "https://example.com",
          "data_hash": "2a3f9a878b3b9ac18a65c16ed1c92c37fd4f5a16e629580a23330f6e0f6e0f6e"
        }
      },
      {
        "tag": "register_drep",
        "drep_credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "coin": "500000000",
        "anchor": {
          "url": "https://example.com",
          "data_hash": "2a3f9a878b3b9ac18a65c16ed1c92c37fd4f5a16e629580a23330f6e0f6e0f6e"
        }
      },
      {
        "tag": "unregister_drep",
        "drep_credential": {
          "tag": "pubkey_hash",
          "value": "f1d3ff8443297732862df21dc4e57262a7a5da37d6e9600fcd4fdd9f"
        },
        "coin": "500000000"
      },
      {
        "tag": "update_drep",
        "drep_credential": {
          "tag": "script_hash",
          "value": "0d93bffbd38c1a5da47b6e93471f7e3c5ae52da6c12b687b11e2d3d1"
        },
        "anchor": {
          "url": "https://example.com",
          "data_hash": "2a3f9a878b3b9ac18a65c16ed1c92c37fd4f5a16e629580a23330f6e0f6e0f6e"
        }
      }
    ];

    const negFixtures = [
    ];

    assertions('Certificate', fixtures, negFixtures);
  });



  describe('GovAction', function () {
    const fixtures = [
      {
        "tag": "parameter_change_action",
        "gov_action_id": {
          "transaction_id": '0000000000000000000000000000000000000000000000000000000000000000',
          "gov_action_index": '1'
        },
        "protocol_param_update": {
          "ada_per_utxo_byte": "1000",
          "collateral_percentage": 150,
          "cost_models": {
            plutus_v1: new Array(166).fill('123'),
            plutus_v2: new Array(175).fill('123'),
            plutus_v3: new Array(251).fill('123')

          }
        },
        "policy_hash": '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
      },
      {
        "tag": "hard_fork_initiation_action",
        "gov_action_id": {
          "transaction_id": '0000000000000000000000000000000000000000000000000000000000000000',
          "gov_action_index": "2"
        },
        "protocol_version": {
          "major": 3,
          "minor": 0
        }
      },
      {
        "tag": "treasury_withdrawals_action",
        "gov_action_id": {
          "transaction_id": '0000000000000000000000000000000000000000000000000000000000000000',
          "gov_action_index": "3"
        },
        "rewards": [
          {
            "key": "stake1u87qlejzjkrxm9ja7k6h0x7xuepd3q8njesv2s62lz83ttszp4x0y",
            "value": "100000000"
          }
        ],
        "policy_hash": '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
      },
      {
        "tag": "no_confidence",
        "gov_action_id": {
          "transaction_id": '0000000000000000000000000000000000000000000000000000000000000000',
          "gov_action_index": "4"
        }
      },
      {
        "tag": "update_committee",
        "gov_action_id": {
          "transaction_id": '0000000000000000000000000000000000000000000000000000000000000000',
          "gov_action_index": "5"
        },
        "members_to_remove": [
          {
            "tag": "pubkey_hash",
            "value": '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
          }
        ],
        "committee": [
          {
            "key": {
              "tag": "pubkey_hash",
              "value": '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
            },
            "value": "1000000"
          }
        ],
        "signature_threshold": {
          "numerator": "2",
          "denominator": "3"
        }
      },
      {
        "tag": "new_constitution",
        "gov_action_id": {
          "transaction_id": '0000000000000000000000000000000000000000000000000000000000000000',
          "gov_action_index": "6"
        },
        "constitution": {
          "anchor": {
            "url": "https://example.com",
            "data_hash": "2a3f9a878b3b9ac18a65c16ed1c92c37fd4f5a16e629580a23330f6e0f6e0f6e"
          },
          "script_hash": '1c12f03c1ef2e935acc35ec2e6f96c650fd3bfba3e96550504d53361'
        }
      },
      {
        "tag": "info_action"
      }
    ];

    const negFixtures = [
    ];

    assertions('GovAction', fixtures, negFixtures);
  });





});
