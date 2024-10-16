/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import  { useState,useEffect } from 'react';
import './style.css'


function convertToFlag(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }

  function getWeatherIcon(wmoCode) {
    const icons = new Map([
      [[0], "☀️"],
      [[1], "🌤"],
      [[2], "⛅️"],
      [[3], "☁️"],
      [[45, 48], "🌫"],
      [[51, 56, 61, 66, 80], "🌦"],
      [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
      [[71, 73, 75, 77, 85, 86], "🌨"],
      [[95], "🌩"],
      [[96, 99], "⛈"],
    ]);
    const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
    if (!arr) return "NOT FOUND";
    return icons.get(arr);
  }
  

  function formatDay(dateStr) {
    return new Intl.DateTimeFormat("en", {
      weekday: "short",
    }).format(new Date(dateStr));
  }
  
const FunctionMethod = () => {
    const [location, setLocation] = useState(localStorage.getItem('location'));
    const [isLoading,setIsLoading]= useState(false)
    const [weather,setWeather]= useState({})
    const[displayLocation, setDisplayLocation]= useState('')
    const [country, setCounty]=useState('')

     console.log(country)


    useEffect(function(){

        const getWeather= async()=>{

              setIsLoading(true)
            if(location.length < 2){
                return  setWeather({})
            } 


            else{
           try {

            const geoRes = await fetch( `https://geocoding-api.open-meteo.com/v1/search?name=${location}`)
            const res = await geoRes.json();
     // if (!geoRes.results) throw new Error("Location not found");
    const {latitude, longitude, timezone, name, country_code } =res.results.at(0)
    setDisplayLocation(`${name}  ${convertToFlag(country_code)} `)
    localStorage.setItem("location", location);
    setCounty(res.results.at(0))


    const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      setWeather({ weather: weatherData.daily });



           } catch (error) {
            console.log(error)
           }
           finally{
          setIsLoading(false)
          localStorage.setItem("location", location);
           } 
        }
    }

        getWeather()
    },[location])
  return (
    <div className='nn'>

<input
    type="text"
    placeholder="Search from location..."
    value={location}
    onChange={(e) => setLocation(e.target.value)}
/>

       {isLoading && <p>loading ....</p>}

      {weather.weather? <Wether location={displayLocation} weather={weather}  country={country} />:''}

    </div>
  )
}

export default FunctionMethod



   function Wether({weather,location,country}){

    const { temperature_2m_max: max,
        temperature_2m_min: min,
        time: dates, 
        weathercode: codes,}=weather.weather ||{}
    return<div>
      <h2>{location}</h2>
      <ul className='weather'>

        {dates.map((day,i)=><li key={day} className='day'>
        <span>{getWeatherIcon(codes.at(i))}</span>

        <p>
          {Math.floor(min.at(i))}&deg; &mdash; <strong>{Math.ceil(max.at(i))}&deg;</strong>
        </p>
        <p>{i===0 ? "Today" : formatDay(day)}</p>

        </li>)}

      </ul>
    </div>
   }
