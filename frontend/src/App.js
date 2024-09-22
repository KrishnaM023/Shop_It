import "./App.css";

import { BrowserRouter as Router, Routes } from "react-router-dom";

import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import { Toaster } from "react-hot-toast";

import useUserRoutes from "./components/routes/userRoutes";
import useAdminRoutes from "./components/routes/adminRoutes";

function App() {
  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();

  return (
    <Router>
      <div className="App">
        <Toaster position="top-centre" />
        <Header />

        <div className="container">
          <Routes>
            {userRoutes}
            {adminRoutes}
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
