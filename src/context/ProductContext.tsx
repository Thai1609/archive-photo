import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

const ProductContext = createContext();

const ACTIONS = {
  FETCH_SUCCESS: "FETCH_SUCCESS",
};

const productReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, products: action.payload };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, { products: [] });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: res.data });
      } catch (err) {
        console.error("Lỗi tải sản phẩm");
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook để sử dụng ProductContext
export const useProductContext = () => useContext(ProductContext);
