// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Vanity from '@polkadot/app-accounts/vanityAccount';

export default ([
  {
    Component: Vanity,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Vanity'
    },
    icon: 'users',
    name: 'vanity'
  }
] as Routes);
