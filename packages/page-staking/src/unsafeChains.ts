// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export const UNSAFE_CHAINS = ['Development', 'Kusama CC1', 'Kusama CC2', 'Kusama CC3', 'Kusama', 'Crab'];

export default function detectUnsafe (chain: Text | string): boolean {
  console.log(111, chain.toString())
  return UNSAFE_CHAINS.includes(chain.toString());
}
