import { Idl } from '@project-serum/anchor';

const idl: Idl = {
  version: '0.1.0',
  name: 'nosana_jobs',
  instructions: [
    {
      name: 'open',
      accounts: [
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'accessKey',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'jobExpiration',
          type: 'i64',
        },
        {
          name: 'jobPrice',
          type: 'u64',
        },
        {
          name: 'jobTimeout',
          type: 'i64',
        },
        {
          name: 'jobType',
          type: 'u8',
        },
        {
          name: 'nodeXnosMinimum',
          type: 'u64',
        },
      ],
    },
    {
      name: 'update',
      accounts: [
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'accessKey',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'jobExpiration',
          type: 'i64',
        },
        {
          name: 'jobPrice',
          type: 'u64',
        },
        {
          name: 'jobTimeout',
          type: 'i64',
        },
        {
          name: 'jobType',
          type: 'u8',
        },
        {
          name: 'nodeStakeMinimum',
          type: 'u64',
        },
      ],
    },
    {
      name: 'close',
      accounts: [
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'list',
      accounts: [
        {
          name: 'job',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'run',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'rewardsReflection',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rewardsVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'rewardsProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'ipfsJob',
          type: {
            array: ['u8', 32],
          },
        },
      ],
    },
    {
      name: 'recover',
      accounts: [
        {
          name: 'job',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'work',
      accounts: [
        {
          name: 'run',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'stake',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nft',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'metadata',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'stop',
      accounts: [
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: 'claim',
      accounts: [
        {
          name: 'job',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'run',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'stake',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nft',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'metadata',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'finish',
      accounts: [
        {
          name: 'job',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'run',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'ipfsResult',
          type: {
            array: ['u8', 32],
          },
        },
      ],
    },
    {
      name: 'quit',
      accounts: [
        {
          name: 'job',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'run',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: 'clean',
      accounts: [
        {
          name: 'job',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'MarketAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'jobExpiration',
            type: 'i64',
          },
          {
            name: 'jobPrice',
            type: 'u64',
          },
          {
            name: 'jobTimeout',
            type: 'i64',
          },
          {
            name: 'jobType',
            type: 'u8',
          },
          {
            name: 'vault',
            type: 'publicKey',
          },
          {
            name: 'vaultBump',
            type: 'u8',
          },
          {
            name: 'nodeAccessKey',
            type: 'publicKey',
          },
          {
            name: 'nodeXnosMinimum',
            type: 'u64',
          },
          {
            name: 'queueType',
            type: 'u8',
          },
          {
            name: 'queue',
            type: {
              vec: 'publicKey',
            },
          },
        ],
      },
    },
    {
      name: 'JobAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'ipfsJob',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'ipfsResult',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'market',
            type: 'publicKey',
          },
          {
            name: 'node',
            type: 'publicKey',
          },
          {
            name: 'payer',
            type: 'publicKey',
          },
          {
            name: 'price',
            type: 'u64',
          },
          {
            name: 'project',
            type: 'publicKey',
          },
          {
            name: 'state',
            type: 'u8',
          },
          {
            name: 'timeEnd',
            type: 'i64',
          },
          {
            name: 'timeStart',
            type: 'i64',
          },
        ],
      },
    },
    {
      name: 'RunAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'job',
            type: 'publicKey',
          },
          {
            name: 'node',
            type: 'publicKey',
          },
          {
            name: 'payer',
            type: 'publicKey',
          },
          {
            name: 'state',
            type: 'u8',
          },
          {
            name: 'time',
            type: 'i64',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'QueueType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Job',
          },
          {
            name: 'Node',
          },
          {
            name: 'Empty',
          },
        ],
      },
    },
    {
      name: 'JobState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Queued',
          },
          {
            name: 'Running',
          },
          {
            name: 'Done',
          },
          {
            name: 'Stopped',
          },
        ],
      },
    },
    {
      name: 'JobType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Default',
          },
          {
            name: 'Small',
          },
          {
            name: 'Medium',
          },
          {
            name: 'Large',
          },
          {
            name: 'Gpu',
          },
          {
            name: 'Unknown',
          },
        ],
      },
    },
  ],
};

export default idl;
