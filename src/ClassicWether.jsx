/* eslint-disable react/prop-types */
import React from 'react'
import './style.css'


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
  
  function convertToFlag(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }
  
  function formatDay(dateStr) {
    return new Intl.DateTimeFormat("en", {
      weekday: "short",
    }).format(new Date(dateStr));
  }
  
  
class ClassicWether extends React.Component{
  state={ location: "",
    isLoading: false,
    displayLocation: "",
    weather: {},}

    fecthDate= async()=>{
    if (this.state.location.length < 2) return this.setState({ weather: {} });

    try {
      this.setState({ isLoading: true });

      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);

      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
      console.log(weatherData.daily)
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
    }

   }


   setLocation = (e) => this.setState({ location: e.target.value });
  

   componentDidMount(){
    this.setState({location:localStorage.getItem('location')|| ''})
   }
   componentDidUpdate(preProps,preState){
    if(this.state.location !==preState.location){
      this.fecthDate()
      localStorage.setItem('location',this.state.location)
    }

   }
    render (){


      return(  <div className='app'>


<h1> CLASSIY WEALTHER</h1>

    <div className='flex flex-col'>

        <Input location={this.state.location} onChangeLocation={this.setLocation}/>

        {this.state.isLoading&&<p className='loader'>Loading.... </p>}
        {this.state.weather.weathercode && <Wealther weather={this.state.weather} location={this.state.displayLocation}/>}
    </div>
      </div>)
    }

}


export default ClassicWether


class Input extends React.Component{
   render(){
    return    <input type="text" placeholder=' search from location'
    value={this.props.location}
    onChange={this.props.onChangeLocation}
    />

   }
}

class Wealther extends React.Component{
 
    render(){


        const {
            temperature_2m_max: max,
            temperature_2m_min: min,
            time: dates,
            weathercode: codes,
          } = this.props.weather;
        console.log(this.props)

        return  <div>
            <h2>Wealther {this.props.location}</h2>
            <ul className='weather'>
             {dates.map((date,i)=><Day key={date}
              max={max.at(i)} min={min.at(i)} 
              data={date}
              isToday={i===0}
               codes={codes.at(i)}  ></Day>)}
            </ul>
        </div>
    }
}



class Day extends React.Component{
    render(){
        const {max, min, data,codes,isToday}=this.props
        return <li className='day'>
                  <span>{ getWeatherIcon(codes)}</span>
                  <p>{isToday?'Today': formatDay(data)}</p>


        <p> {Math.floor(min)}&deg; &mdash; <strong>{Math.ceil(max)}&deg;</strong></p>
   
        </li>
    }
}