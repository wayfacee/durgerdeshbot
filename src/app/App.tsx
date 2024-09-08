import { ProductList } from "@/entities/Product";
import { ProductForm } from "@/entities/Product/ui/ProductForm/ProductForm";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product-form" element={<ProductForm />} />
      </Routes>
    </div>
  );
};

export default App;
