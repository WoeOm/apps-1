// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Address, AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import AccountIndex from './AccountIndex';
import AccountAddress from './AccountAddress';
import AccountName from './AccountName';
import IdentityIcon from './IdentityIcon';

function toIdString(id?: string | Address | AccountId | null | Uint8Array): string | null {
  return id
    ? id.toString()
    : null;
}

interface Props {
  className?: string;
  defaultName?: string;
  onClickName?: () => void;
  overrideName?: React.ReactNode;
  toggle?: any;
  value?: string | Address | AccountId | null | Uint8Array;
  isLink?: boolean;
}

function AddressSmall ({ className, defaultName, onClickName, overrideName, toggle, value, isLink }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--AddressSmall ${className}`}>
      <IdentityIcon
        size={36}
        value={value as Uint8Array}
      />
      <div className='nameInfo'>
        <AccountName
          className={(overrideName || !onClickName) ? '' : 'name--clickable'}
          defaultName={defaultName}
          override={overrideName}
          onClick={onClickName}
          toggle={toggle}
          value={value}
          isLink={isLink}
          showAddress={false}
        />
        <AccountAddress value={value} />
      </div>
    </div>
  );
}

export default styled(AddressSmall)`
  vertical-align: middle;
  white-space: nowrap;

  .name--clickable {
    cursor: pointer;
  }

  .ui--IdentityIcon,
  .nameInfo {
    display: inline-block;
    vertical-align: middle;
  }

  .ui--IdentityIcon {
    margin-right: 0.75rem;
  }

  .nameInfo {
    > div {
      max-width: 16rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
