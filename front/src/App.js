import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Pages/Login';
import 'react-toastify/dist/ReactToastify.css';
import Header from './component/Header';
import Sidebar from './component/Sidebar';
import Main from './component/Main';
import Register from './Pages/Register';
import Quiz from './Pages/Quiz';
import AddQuestion from './Pages/AddQuestion';
import Profile from './Pages/Profile';
import AdminLogin from './Pages/AdminLogin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />}></Route>

        <Route path='/login' element={<Login />}></Route>
        <Route path='/header' element={<Header />}></Route>
        <Route path='/sidebar' element={<Sidebar />}></Route>


        <Route path='/register' element={<Register />}></Route>
        <Route path='/Quiz' element={<Quiz />}></Route>
        <Route path='/AddQuestion' element={<AddQuestion />}></Route>
        <Route path='/Profile' element={<Profile />}></Route>
        <Route path='/AdminLogin' element={<AdminLogin />}></Route>
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
