import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./layout";
import { NotFound, Quizzes, TakeQuiz } from "./pages";

function App() {
  return (
    <BrowserRouter>
      {/* <ToastContainer /> */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Quizzes />} />
          <Route path="quiz/:id" element={<TakeQuiz />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
