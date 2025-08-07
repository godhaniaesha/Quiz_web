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
import Layout from './component/Layout';
import Logout from './Pages/Logout';
import Users from './Pages/Users';
import Results from './Pages/Results';
import Questions from './Pages/Questions';
import Quizzes from './Pages/Quizzes';
import Dashboard from './Pages/Dashboard';
import Technology from './Pages/Technology';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />}></Route>
        <Route path='/Layout' element={<Layout />}></Route>


        <Route path='/login' element={<Login />}></Route>
        <Route path='/header' element={<Header />}></Route>
        <Route path='/sidebar' element={<Sidebar />}></Route>

        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/quizzes' element={<Quizzes />}></Route>
        <Route path='/questions' element={<Questions />}></Route>
        <Route path='/results' element={<Results />}></Route>
        <Route path='/techn' element={<Technology />}></Route>
        <Route path='/logout' element={<Logout />}></Route>
                



        <Route path='/register' element={<Register />}></Route>
        <Route path='/Quiz' element={<Quiz />}></Route>
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
