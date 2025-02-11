// Step 1: Define action types
export const TAG_ACTIONS = {
  FETCH_TAGS: "FETCH_TAGS", // Lấy danh sách tags
  ADD_TAG: "ADD_TAG", // Thêm tag
  REMOVE_TAG: "REMOVE_TAG", // Xóa tag
  ERROR: "ERROR", // Lỗi
  LOADING: "LOADING", // Trạng thái loading
} as const;

export type Tag = {
  name: any;
  id: number;
  nameTag: string;
  description: string;
};

export interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

export const initialTagState: TagState = {
  tags: [],
  loading: false,
  error: null,
};

// Step 3: Define the reducer function with typed action
type TagAction =
  | { type: typeof TAG_ACTIONS.FETCH_TAGS; payload: Tag[] }
  | { type: typeof TAG_ACTIONS.ADD_TAG; payload: Tag }
  | { type: typeof TAG_ACTIONS.REMOVE_TAG; payload: string }
  | { type: typeof TAG_ACTIONS.ERROR; payload: string }
  | { type: typeof TAG_ACTIONS.LOADING; payload: boolean };

function tagReducer(state: TagState, action: TagAction): TagState {
  switch (action.type) {
    case TAG_ACTIONS.FETCH_TAGS:
      return { ...state, tags: action.payload, loading: false, error: null };

    case TAG_ACTIONS.ADD_TAG:
      return {
        ...state,
        tags: [...state.tags, action.payload],
        loading: false,
      };

    case TAG_ACTIONS.REMOVE_TAG:
      return {
        ...state,
        tags: state.tags.filter((tag) => tag.nameTag !== action.payload),
        loading: false,
      };

    case TAG_ACTIONS.ERROR:
      return { ...state, error: action.payload, loading: false };

    case TAG_ACTIONS.LOADING:
      return { ...state, loading: action.payload };

    default:
      return state;
  }
}

export default tagReducer;
