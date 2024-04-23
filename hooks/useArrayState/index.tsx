import { useState } from 'react';

import type { UseArrayStateReturn } from './types';

export const useArrayState = <T,>(initialState: Array<T> = []): UseArrayStateReturn<T> => {
  const [state, setState] = useState<Array<T>>(initialState);

  const add = (value: T): void => {
    setState((prevState) => [...prevState, value]);
  };

  const update = (index: number, value: T): void => {
    setState((prevState) => {
      const newState = [...prevState];

      newState[index] = value;

      return newState;
    });
  };

  const remove = (index: number): void => {
    setState((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  const setData = (data: Array<T>): void => {
    setState(data);
  };

  const clearArray = (): void => {
    setState([]);
  };

  const resetArray = (): void => {
    setState(initialState);
  };

  return {
    state,
    actions: { add, remove, setData, clearArray, resetArray, update },
  };
};
