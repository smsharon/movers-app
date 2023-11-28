// App.js
import React from 'react';
// import { Route, Routes } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';

function App() {
  return (
    <div className="App">
      {/* <Login/>  */}
      <Signup/>
    {/* <Routes>
      <Route>
          <Route path="/" component={SignUp} />
          <Route path="/login" component={Login} />
          </Route>
    </Routes> */}
    </div>
  );
}

export default App;

