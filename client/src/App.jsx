import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProductList from './features/product/ProductList';
import FinishOrderForm from './features/order/FinishOrderForm';
import OrderSummary from './features/order/CartSummary';

function App() {
  return (
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/summary" element={<OrderSummary />} />
        <Route path="/finish-order" element={<FinishOrderForm />} />
        {/* הוסף עוד מסכים בהמשך */}
      </Routes>
  );
}

export default App;
