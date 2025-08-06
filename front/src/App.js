import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import ForgotPassword from './Pages/ForgotPassword';
import EmailVerificaion from './Pages/EmailVerification';
import ResetPassword from './Pages/ResetPassword';
import Dashboard from './Pages/Dashboard';
import Main from './Pages/Main';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword />}></Route>
        <Route path='/emailVerification' element={<EmailVerificaion />}></Route>
        <Route path='/resetPassword' element={<ResetPassword />}></Route>
        <Route path='/spinner' element={<Spinner />}></Route>

        <Route path='/' element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path='category/add' element={<CategoryForm />} />
          
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
