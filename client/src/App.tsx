import axios from 'axios';
import MainPage from 'pages/MainPage';
import React from 'react';
import './App.css';
import './Main.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';
import MobileMainPage from 'pages/MobileMainPage';
import MobileWorkspace from 'pages/MobileWorkspace';

function App() {

  // console.log(process.env.REACT_APP_API_KEY);

  axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

  axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.REACT_APP_API_KEY}`

  return (
    <BrowserRouter>
      <BrowserView>
        <Routes>
          <Route path="*" element={<MainPage/>}/>
        </Routes>
      </BrowserView>
      <MobileView>
        <Routes>
          <Route path='*' element={<MobileMainPage/>}/>
          <Route path='/workspace' element={<MobileWorkspace/>}/>
        </Routes>
      </MobileView>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
