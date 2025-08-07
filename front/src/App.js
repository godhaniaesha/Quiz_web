import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './component/Header';
import Sidebar from './component/Sidebar';
import Main from './component/Main';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />}></Route>

        <Route path='/login' element={<Login />}></Route>
        <Route path='/header' element={<Header />}></Route>
        <Route path='/sidebar' element={<Sidebar />}></Route>


       
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
