import { createContext, useContext, useState, ReactNode } from "react";

// 🔥 Define Context Type
interface ProductFilterContextType {
  filters: {
    name: string;
    categoryId: string;
    parentId: string;
    brandId: string;
    minPrice: string;
    maxPrice: string;
    status: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<ProductFilterContextType["filters"]>
  >;
}

// ✅ Provide default values to prevent TypeScript errors
const ProductFilterContext = createContext<ProductFilterContextType | null>(
  null
);

// ✅ Ensure that all components are wrapped in the Provider
export const ProductFilterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [filters, setFilters] = useState<ProductFilterContextType["filters"]>({
    name: "",
    categoryId: "",
    parentId: "",
    brandId: "",
    minPrice: "",
    maxPrice: "",
    status: "",
  });

  return (
    <ProductFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </ProductFilterContext.Provider>
  );
};

 export const useProductFilter = () => {
  const context = useContext(ProductFilterContext);
  if (!context) {
    throw new Error(
      "useProductFilter must be used within a ProductFilterProvider"
    );
  }
  return context;
};
