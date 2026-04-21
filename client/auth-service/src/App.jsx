// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Success from "./success";
import SelectRole from "./selectRole";
import ChatBrodcast from "./ChatBrodcast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/success" element={<Success />} />
        <Route path="/chat" element={<ChatBrodcast />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
