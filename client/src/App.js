import logo from './logo.svg';
import './App.css';
import LocationCalculator from './Components/Location';
import MovingPriceCalculator from './Components/MovingPriceCalculator';

function App() {
  return (
    <div className="App">
       <LocationCalculator/>
       <MovingPriceCalculator/>
    </div>
  );
}

export default App;
