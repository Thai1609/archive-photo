type ReducerFunction = (state: any, action: any) => any;

export const combineReducers = (reducers: {
  [key: string]: ReducerFunction;
}) => {
  return (state: any, action: any) => {
    return Object.keys(reducers).reduce((newState, key) => {
      newState[key] = reducers[key](state[key], action);
      return newState;
    }, {});
  };
};
