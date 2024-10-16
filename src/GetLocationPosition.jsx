import {useState,useEffect} from 'react'
import { useGeolocation } from './useGeolocation'

const GetLocationPosition = () => {
  const {
    isLoading,
    position: { lat, lng },
    error,
    getPosition
  } = useGeolocation();

  const [countClicks, setCountClicks] = useState(0);

  function handleClick() {
    setCountClicks((count) => count + 1);
    getPosition();
  }


  useEffect(function(){
async function fetchData(url) {
  try {
    const response = await fetch(url); // Await the network request
    const data = await response.json(); // Await the response parsing
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

fetchData("https://api.frankfurter.app/latest?amount=100&from=CAD&to=USD");

  },[])


    return (
      <div style={{background:'gray', display:'flex', flexDirection:'column', justifyContent:'center',
       color:'white', alignItems:'center', gap:'2rem'}}>
        <button onClick={handleClick} disabled={isLoading}>
          Get my position
        </button>
  
        {isLoading && <p>Loading position...</p>}
        {error && <p>{error}</p>}
        {!isLoading && !error && lat && lng && (
          <p>
            Your GPS position:{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
            >
              {lat}, {lng}
            </a>
          </p>
        )}
  
        <p>You requested position {countClicks} times</p>
      </div>
    );
  }
  
export default GetLocationPosition
