import type { Dispatch, SetStateAction } from 'react';

export type UseBooleanReturn = {
  value: boolean;
  actions: {
    setValue: Dispatch<SetStateAction<boolean>>;
    setTrue: () => void;
    setFalse: () => void;
    toggle: () => void;
  };
};
