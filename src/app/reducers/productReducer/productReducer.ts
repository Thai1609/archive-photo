// productReducer.ts
export const PRODUCT_ACTIONS = {
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  ADD_PRODUCT: "ADD_PRODUCT",
  REMOVE_PRODUCT: "REMOVE_PRODUCT",
  SET_PAGE: "SET_PAGE", // If pagination is needed
} as const;

export interface InitialProductState {
  products: [];
  isLoading: boolean;
  isError: boolean;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };
    case PRODUCT_ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case PRODUCT_ACTIONS.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };
    case PRODUCT_ACTIONS.REMOVE_PRODUCT:
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
};

export default productReducer;
