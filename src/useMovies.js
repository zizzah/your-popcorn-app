/* eslint-disable no-unused-vars */
import { useState,useEffect } from "react";


const KEY ='3305d42f'
export function useMovies(query,setSeclectedId){

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    function handleCloseMovi() {
        setSeclectedId(null);
      }


  
    useEffect(
        function () {
          const controller= new AbortController()
          async function move() {
            setIsLoading(true);
            setError("");
    
            try {
              const response = await fetch(
                `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal:controller.signal}
              );
    
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
    
              const data = await response.json();
              if (data.Response === "False") {
                throw new Error("movie not found");
              }
    
              setMovies(data.Search);
              setError('')
            } catch (error) {
              console.log("Error fetching data:", error.message);
              if(error.name !== 'AbortError'){
                setError(error.message);
    
              }
            } finally {
              setIsLoading(false);
            }
          }
    
          if (query.length < 3) {
            setMovies([]);
            setError("");
            return;
          }
          handleCloseMovi();
          move();
    
          return function() {
            controller.abort();
          }
        },
        [query,setSeclectedId,movies]


      );
      

      return {movies,error,isLoading}

}