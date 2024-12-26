export const TAG_ACTIONS = {
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  ADD_TAG_SUCCESS: "ADD_TAG_SUCCESS",
  REMOVE_TAG_SUCCESS: "REMOVE_TAG_SUCCESS",
};

export type Tag = {
  id: number;
  name: string;
  description: string;
};

export const initialTagState = {
  tags: [],
};

export const tagReducer = (state: typeof initialTagState, action: any) => {
  switch (action.type) {
    case TAG_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        tags: action.payload,
      };
    case TAG_ACTIONS.FETCH_ERROR:
      return { ...state, isLoading: false, isError: true };
    case TAG_ACTIONS.ADD_TAG_SUCCESS:
      return { ...state, tags: [...state.tags, action.payload] };
    case TAG_ACTIONS.REMOVE_TAG_SUCCESS:
      return {
        ...state,
        tags: state.tags.filter((tag: Tag) => tag.id !== action.payload.id),
      };
    default:
      throw new Error("Unhandled action type");
  }
};
