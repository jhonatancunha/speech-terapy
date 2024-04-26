import { useCallback, useState } from 'react';

import type { UseBooleanReturn } from './useBooleanState.types';

export const useBoolean = (defaultValue?: boolean): UseBooleanReturn => {
  const [value, setValue] = useState(!!defaultValue);

  const setTrue = useCallback((): void => {
    setValue(true);
  }, []);

  const setFalse = useCallback((): void => {
    setValue(false);
  }, []);

  const toggle = useCallback((): void => {
    setValue((prevState) => !prevState);
  }, []);

  return {
    value,
    actions: {
      setValue,
      setTrue,
      setFalse,
      toggle,
    },
  };
};
