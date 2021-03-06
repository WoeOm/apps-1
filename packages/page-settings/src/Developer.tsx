// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import store from 'store';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';
import { Button, Editor, InputFile } from '@polkadot/react-components';
import { isJsonObject, stringToU8a, u8aToString } from '@polkadot/util';
import { DARWINIA_CRAB_TYPES } from '@polkadot/react-darwinia';

import { useTranslation } from './translate';

const EMPTY_CODE = JSON.stringify(DARWINIA_CRAB_TYPES, undefined, 4);
const EMPTY_TYPES = DARWINIA_CRAB_TYPES;

function Developer ({ className, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [code, setCode] = useState(EMPTY_CODE);
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [isTypesValid, setIsTypesValid] = useState(true);
  const [types, setTypes] = useState<Record<string, any>>(EMPTY_TYPES);
  const [typesPlaceholder, setTypesPlaceholder] = useState<string | null>(null);

  useEffect((): void => {
    const types = store.get('types') || {};

    if (Object.keys(types).length) {
      setCode(JSON.stringify(types, null, 2));
      setTypes({});
      setTypesPlaceholder(Object.keys(types).join(', '));
    }
  }, []);

  const _setState = ({ code, isJsonValid, isTypesValid, types, typesPlaceholder }: { code: string; isJsonValid: boolean; isTypesValid: boolean; types: Record<string, any>; typesPlaceholder: string | null }): void => {
    setCode(code);
    setIsJsonValid(isJsonValid);
    setIsTypesValid(isTypesValid);
    setTypes(types);
    setTypesPlaceholder(typesPlaceholder);
  };
  const _clearTypes = (): void => {
    store.remove('types');

    _setState({
      code: EMPTY_CODE,
      isJsonValid: true,
      isTypesValid: true,
      types: EMPTY_TYPES,
      typesPlaceholder: null
    });
  };
  const _onChangeTypes = (data: Uint8Array): void => {
    const code = u8aToString(data);

    try {
      const types = JSON.parse(code);
      const typesPlaceholder = Object.keys(types).join(', ');

      console.log('Detected types:', typesPlaceholder);

      _setState({
        code,
        isJsonValid: true,
        isTypesValid: true,
        types: Object.keys(types).length === 0 ? {} : types,
        typesPlaceholder
      });
    } catch (error) {
      console.error('Error registering types:', error);

      _setState({
        code,
        isJsonValid: false,
        isTypesValid: false,
        types: {},
        typesPlaceholder: error.message
      });
    }
  };
  const _onEditTypes = (code: string): void => {
    try {
      if (!isJsonObject(code)) {
        throw Error(t('This is not a valid JSON object.'));
      }

      _onChangeTypes(stringToU8a(code));
    } catch (e) {
      setCode(code);
      setIsJsonValid(false);
      setTypesPlaceholder(e.message);
    }
  };
  const _saveDeveloper = (): void => {
    try {
      registry.register(types);
      store.set('types', types);
      setIsTypesValid(true);
      onStatusChange({
        status: 'success',
        action: t('Your custom types have been added')
      });
    } catch (error) {
      console.error(error);
      setIsTypesValid(false);
      onStatusChange({
        status: 'error',
        action: t(`Error saving your custom types. ${error.message}`)
      });
    }
  };

  const typesHasNoEntries = Object.keys(types).length === 0;

  return (
    <div className={className}>
      <div className='ui--row'>
        <div className='full'>
          <InputFile
            clearContent={typesHasNoEntries && isTypesValid}
            help={t('Save the type definitions for your custom structures as key-value pairs in a valid JSON file. The key should be the name of your custom structure and the value an object containing your type definitions.')}
            isError={!isTypesValid}
            label={t('Additional types as a JSON file (or edit below)')}
            onChange={_onChangeTypes}
            placeholder={typesPlaceholder}
          />
        </div>
      </div>
      <div className='ui--row'>
        <div className='full'>
          <Editor
            className='editor'
            code={code}
            isValid={isJsonValid}
            onEdit={_onEditTypes}
          />
        </div>
      </div>
      <Button.Group>
        <Button
          isDisabled={typesHasNoEntries}
          isNegative
          onClick={_clearTypes}
          label={t('Reset')}
          icon='sync'
        />
        <Button
          isDisabled={!isTypesValid || !isJsonValid}
          isPrimary
          onClick={_saveDeveloper}
          label={t('Save')}
          icon='save'
        />
      </Button.Group>
    </div>
  );
}

export default styled(Developer)`
  .editor {
    height: 21rem;
    margin-left: 2rem;
    position: relative;
  }
`;
