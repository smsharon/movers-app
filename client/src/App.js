// App.js
import React from 'react';
// import { Route, Routes } from 'react-router-dom';
//import Signup from './Signup';
//import Login from './Login';
import LocationCalculator from './components/Location';
import MovingPriceCalculator from './components/MovingPriceCalculator';
function App() {
  return (
    <div className="App">
      <LocationCalculator />
      <MovingPriceCalculator />
      {/* <Login/>  */}
      {/*<Signup/>
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

