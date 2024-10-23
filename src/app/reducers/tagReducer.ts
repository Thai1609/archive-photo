 
   
  export const ACTIONS = {
    FETCH_INIT: 'FETCH_INIT',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
    ADD_TAG_SUCCESS: 'ADD_TAG_SUCCESS',
    REMOVE_TAG_SUCCESS: 'REMOVE_TAG_SUCCESS',
  };
  
  type Tag = {
    id: number;
    name: string;
    description: string;
  };
  
  const tagReducer = (state: any, action: any) => {
    switch (action.type) {
      case ACTIONS.FETCH_INIT:
        return { ...state, isLoading: true, isError: false };
      case ACTIONS.FETCH_SUCCESS:
        return { ...state, isLoading: false, isError: false, tags: action.payload };
      case ACTIONS.FETCH_ERROR:
        return { ...state, isLoading: false, isError: true };
      case ACTIONS.ADD_TAG_SUCCESS:
        return { ...state, tags: [...state.tags, action.payload] };
      case ACTIONS.REMOVE_TAG_SUCCESS:
        return {
          ...state,
          tags: state.tags.filter((tag: Tag) => tag.id !== action.payload.id),
        };
      default:
        throw new Error('Unhandled action type');
    }
  };
  export default tagReducer;