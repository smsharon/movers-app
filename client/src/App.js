// App.js
import React from 'react';
// import InventoryForm from './Components/Inventory';
// import { Route, Routes } from 'react-router-dom';
//import Signup from './Signup';
//import Login from './Login';
// import LocationCalculator from './Components/Location';
// import MovingPriceCalculator from './Components/MovingPriceCalculator'
import CustomNavbar from './component/Navbar';

function App() {
  return (
    <div className="App">
      <CustomNavbar/>
      {/* <InventoryForm/> */}
      {/* <LocationCalculator /> */}
      {/* <MovingPriceCalculator /> */}
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

