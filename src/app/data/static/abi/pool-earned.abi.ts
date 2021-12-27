import { AbiItem } from 'web3-utils';

export const POOL_WITH_EARNED_METHOD_WITH_2_ARGUMENTS: AbiItem[] = [
  {
    constant: true,
    inputs: [
      { internalType: 'uint256', name: 'i', type: 'uint256' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'earned',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
