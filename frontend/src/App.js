import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import { Toaster } from "react-hot-toast";
import ProductDetails from "./components/product/ProductDetails";

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-centre" />
        <Header />

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/product/:id" element={<ProductDetails />}/>
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;