import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Pages/Login';
import 'react-toastify/dist/ReactToastify.css';
import Register from './Pages/Register';
import Quiz from './Pages/Quiz';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/Quiz' element={<Quiz />}></Route>
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
