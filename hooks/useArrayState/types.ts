export interface UseArrayStateReturn<T> {
  state: Array<T>;
  actions: {
    add: (value: T) => void;
    remove: (index: number) => void;
    update: (index: number, value: T) => void;
    setData: (data: Array<T>) => void;
    clearArray: () => void;
    resetArray: () => void;
  };
}
