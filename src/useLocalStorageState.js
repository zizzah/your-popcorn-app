import {useState, useEffect} from 'react'

export function useLocalStorageState(initials,key){


    const [value, setValue] = useState(function(){
        const store = localStorage.getItem(key)
        return  store ? JSON.parse(store) : initials
     });

     useEffect(function(){
        localStorage.setItem(key, JSON.stringify(value))
     
     
     },[value,key])

     return [value, setValue]
}

