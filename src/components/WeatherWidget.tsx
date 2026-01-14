import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState<string>('sunny');
  const [temp, setTemp] = useState<number>(24);

  useEffect(() => {
    const weathers = ['sunny', 'cloudy', 'rainy', 'windy'];
    const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
    const randomTemp = Math.floor(Math.random() * 15) + 15;
    
    setWeather(randomWeather);
    setTemp(randomTemp);
  }, []);

  const getWeatherIcon = () => {
    switch (weather) {
      case 'sunny':
        return <Sun size={16} className="text-yellow-500" />;
      case 'cloudy':
        return <Cloud size={16} className="text-gray-400" />;
      case 'rainy':
        return <CloudRain size={16} className="text-blue-500" />;
      case 'windy':
        return <Wind size={16} className="text-slate-500" />;
      default:
        return <Sun size={16} className="text-yellow-500" />;
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 justify-center mb-2">
      {getWeatherIcon()}
      <span>{temp}°C en Colonia</span>
    </div>
  );
}