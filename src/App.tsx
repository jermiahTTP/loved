import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/Index";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<IndexPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
