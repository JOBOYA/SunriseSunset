import React, { useState } from 'react';
import sunIcon from '../assets/sun.svg';
import moonIcon from '../assets/moon.svg';
import Loaders from './Loader';
import 'whatwg-fetch';
import { format, parseISO } from 'date-fns';



const OPEN_CAGE_API_KEY = process.env.REACT_APP_OPEN_CAGE_API_KEY

interface SunriseSunsetData {
  city: string;
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: number;
  civil_twilight_begin: string;
  civil_twilight_end: string;
  nautical_twilight_begin: string;
  nautical_twilight_end: string;
  astronomical_twilight_begin: string;
  astronomical_twilight_end: string;
 
}








const SunriseSunsetSearch: React.FC = ()=> {
  const [city, setCity] = useState('');
  const [data, setData] = useState<SunriseSunsetData | null>(null);
  const [loading, setLoading] = useState(false);


  const fetchSunriseSunsetData = async () => {
    setLoading(true);
    const openCageResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${OPEN_CAGE_API_KEY}`);
    const openCageResult = await openCageResponse.json();

    if (openCageResult.status.code !== 200) {
      alert('Erreur lors de la récupération des coordonnées.');
      return;
    }

    const lat = openCageResult.results[0].geometry.lat;
    const lng = openCageResult.results[0].geometry.lng;

    const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
    const result = await response.json();

    
      if (result.status === 'OK') {
        setData({
          city: openCageResult.results[0].formatted,
          ...result.results,
          sunrise: format(parseISO(result.results.sunrise), "d MMM yyyy à HH:mm"),
          sunset: format(parseISO(result.results.sunset), "d MMM yyyy à HH:mm"),
        });
    } else {
      setData(null);
      alert('Erreur lors de la récupération des données.');
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchSunriseSunsetData();
  };


  //use tailwindcss to style the page

  return (
    

    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center mt-28">
     
      <h1 className="text-6xl font-bold text-center">Sunrise Sunset</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center relative">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Entrez le nom d'une ville"
            className="w-64 px-4 py-2 mt-4 text-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        <button>
   RECHERCHE
    <div id="clip">
        <div id="leftTop" className="corner"></div>
        <div id="rightBottom" className="corner"></div>
        <div id="rightTop" className="corner"></div>
        <div id="leftBottom" className="corner"></div>
    </div>
    <span id="rightArrow" className="arrow"></span>
    <span id="leftArrow" className="arrow"></span>
</button>
        </form>
        {loading && data === null && <Loaders />}
        {data !== null && (
           <>
           <p className="text-2xl font-bold text-white mt-4">{data.city}</p>
           <div className="flex flex-wrap justify-center mt-8">
           
           </div>
         

          <div className="flex flex-wrap justify-center mt-8">
            
    <div className="flex flex-col items-center justify-center mx-4">
      <div className="flex items-center justify-center w-64 h-64 bg-gray-200 rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 cursor-pointer">
        <img src={sunIcon} alt="sun" className="w-32 h-32" />
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <p className="text-2xl font-bold text-white">Lever du soleil</p>
                  <p className="text-xl text-white italic">{data.sunrise}</p>
      </div>
    </div>
    <div className="flex flex-col items-center justify-center mx-4">
      <div className="flex items-center justify-center w-64 h-64 bg-gray-200 rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 cursor-pointer">
        <img src={moonIcon} alt="moon" className="w-32 h-32" />
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
                <p className="text-2xl font-bold text-white">Coucher du soleil</p>
              
        <p className="text-xl text-white italic">{data.sunset}</p>

                
      </div>
    </div>
            </div>
            </>
)}

      </div>
    </div>
  );
};

   
export default SunriseSunsetSearch;