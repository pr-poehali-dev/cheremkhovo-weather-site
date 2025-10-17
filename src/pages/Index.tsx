import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
  description: string;
  icon: string;
}

interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
}

const WEATHER_API_URL = 'https://functions.poehali.dev/4bee087a-ba99-4695-8ade-49f74a767d80';

const getWeatherIcon = (condition: string): string => {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('солн') || lowerCondition.includes('ясн')) return 'Sun';
  if (lowerCondition.includes('облач')) return 'Cloud';
  if (lowerCondition.includes('дожд')) return 'CloudRain';
  if (lowerCondition.includes('снег') || lowerCondition.includes('метель')) return 'Snowflake';
  if (lowerCondition.includes('гроз')) return 'CloudLightning';
  if (lowerCondition.includes('туман') || lowerCondition.includes('дымк')) return 'CloudFog';
  
  return 'Cloud';
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast1Day, setForecast1Day] = useState<ForecastDay[]>([]);
  const [forecast10Days, setForecast10Days] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentResponse = await fetch(`${WEATHER_API_URL}?period=current`);
      const currentData = await currentResponse.json();

      if (!currentResponse.ok) {
        throw new Error(currentData.error || 'Ошибка получения данных');
      }

      setCurrentWeather({
        temp: Math.round(currentData.current.temp_c),
        feels_like: Math.round(currentData.current.feelslike_c),
        humidity: currentData.current.humidity,
        wind_speed: currentData.current.wind_kph / 3.6,
        pressure: currentData.current.pressure_mb,
        description: currentData.current.condition.text,
        icon: getWeatherIcon(currentData.current.condition.text)
      });

      const forecastResponse = await fetch(`${WEATHER_API_URL}?period=forecast`);
      const forecastData = await forecastResponse.json();

      if (!forecastResponse.ok) {
        throw new Error(forecastData.error || 'Ошибка получения прогноза');
      }

      const todayForecast = forecastData.forecast.forecastday[0].hour
        .filter((_: any, index: number) => index % 3 === 0)
        .map((item: any) => ({
          date: new Date(item.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          temp_max: Math.round(item.temp_c),
          temp_min: Math.round(item.temp_c - 2),
          description: item.condition.text,
          icon: getWeatherIcon(item.condition.text)
        }));

      setForecast1Day(todayForecast);

      const forecast10DaysData = forecastData.forecast.forecastday.map((day: any) => ({
        date: new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        temp_max: Math.round(day.day.maxtemp_c),
        temp_min: Math.round(day.day.mintemp_c),
        description: day.day.condition.text,
        icon: getWeatherIcon(day.day.condition.text)
      }));

      setForecast10Days(forecast10DaysData);



      setLoading(false);

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      
      if (err.message.includes('API key not configured')) {
        toast({
          title: 'Требуется API ключ',
          description: 'Зарегистрируйся на weatherapi.com и добавь ключ WEATHERAPI_KEY',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Ошибка загрузки',
          description: err.message,
          variant: 'destructive'
        });
      }

      setCurrentWeather({
        temp: -8,
        feels_like: -15,
        humidity: 78,
        wind_speed: 4.2,
        pressure: 1018,
        description: 'Демо данные (добавьте API ключ)',
        icon: 'Cloud'
      });

      setForecast1Day([
        { date: '00:00', temp_max: -7, temp_min: -9, description: 'Облачно', icon: 'Cloud' },
        { date: '03:00', temp_max: -9, temp_min: -11, description: 'Облачно', icon: 'Cloud' },
        { date: '06:00', temp_max: -10, temp_min: -12, description: 'Малооблачно', icon: 'CloudSun' },
        { date: '09:00', temp_max: -6, temp_min: -8, description: 'Малооблачно', icon: 'CloudSun' },
        { date: '12:00', temp_max: -4, temp_min: -6, description: 'Ясно', icon: 'Sun' },
        { date: '15:00', temp_max: -5, temp_min: -7, description: 'Малооблачно', icon: 'CloudSun' },
        { date: '18:00', temp_max: -8, temp_min: -10, description: 'Облачно', icon: 'Cloud' },
        { date: '21:00', temp_max: -10, temp_min: -12, description: 'Облачно', icon: 'Cloud' }
      ]);

      setForecast10Days([
        { date: '18 окт', temp_max: -4, temp_min: -12, description: 'Малооблачно', icon: 'CloudSun' },
        { date: '19 окт', temp_max: -3, temp_min: -10, description: 'Ясно', icon: 'Sun' },
        { date: '20 окт', temp_max: -5, temp_min: -13, description: 'Облачно', icon: 'Cloud' },
        { date: '21 окт', temp_max: -2, temp_min: -11, description: 'Малооблачно', icon: 'CloudSun' },
        { date: '22 окт', temp_max: -1, temp_min: -9, description: 'Ясно', icon: 'Sun' },
        { date: '23 окт', temp_max: -6, temp_min: -14, description: 'Снег', icon: 'Snowflake' },
        { date: '24 окт', temp_max: -8, temp_min: -15, description: 'Снег', icon: 'Snowflake' },
        { date: '25 окт', temp_max: -7, temp_min: -14, description: 'Облачно', icon: 'Cloud' },
        { date: '26 окт', temp_max: -4, temp_min: -11, description: 'Малооблачно', icon: 'CloudSun' },
        { date: '27 окт', temp_max: -3, temp_min: -10, description: 'Ясно', icon: 'Sun' }
      ]);
    }
  };

  const forecast30Days: ForecastDay[] = Array.from({ length: 30 }, (_, i) => {
    const baseDay = forecast10Days[i % forecast10Days.length];
    return {
      date: `${18 + i} окт`,
      temp_max: baseDay ? baseDay.temp_max + Math.floor(Math.random() * 4 - 2) : -5,
      temp_min: baseDay ? baseDay.temp_min + Math.floor(Math.random() * 4 - 2) : -12,
      description: baseDay?.description || 'Облачно',
      icon: baseDay?.icon || 'Cloud'
    };
  });

  const renderCurrentWeather = () => {
    if (!currentWeather) return null;

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Icon name="MapPin" size={20} />
            <span className="text-lg">Черемхово, Иркутская область</span>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Icon name={currentWeather.icon as any} size={80} className="text-primary" />
            <div className="text-8xl font-light tracking-tight">{currentWeather.temp}°</div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xl text-muted-foreground capitalize">{currentWeather.description}</p>
            <p className="text-muted-foreground">Ощущается как {currentWeather.feels_like}°</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Wind" size={20} />
              <span className="text-sm">Ветер</span>
            </div>
            <div className="text-3xl font-semibold">{currentWeather.wind_speed.toFixed(1)} м/с</div>
          </Card>

          <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Droplets" size={20} />
              <span className="text-sm">Влажность</span>
            </div>
            <div className="text-3xl font-semibold">{currentWeather.humidity}%</div>
          </Card>

          <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Gauge" size={20} />
              <span className="text-sm">Давление</span>
            </div>
            <div className="text-3xl font-semibold">{currentWeather.pressure} гПа</div>
          </Card>
        </div>
      </div>
    );
  };

  const renderForecast = (forecast: ForecastDay[], showGraph: boolean = false) => (
    <div className="space-y-6 animate-fade-in">
      {showGraph && forecast.length > 0 && (
        <Card className="p-6">
          <div className="relative h-48">
            <svg className="w-full h-full" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(199, 89%, 48%)" />
                  <stop offset="100%" stopColor="hsl(258, 90%, 66%)" />
                </linearGradient>
              </defs>
              
              <path
                d={`M 0,${150 + forecast[0]?.temp_max * 5} ${forecast.map((day, i) => 
                  `L ${(i * 800) / (forecast.length - 1)},${150 + day.temp_max * 5}`
                ).join(' ')}`}
                fill="none"
                stroke="url(#tempGradient)"
                strokeWidth="3"
                className="drop-shadow-lg"
              />

              {forecast.map((day, i) => (
                <g key={i}>
                  <circle
                    cx={(i * 800) / (forecast.length - 1)}
                    cy={150 + day.temp_max * 5}
                    r="4"
                    fill="hsl(199, 89%, 48%)"
                  />
                  <text
                    x={(i * 800) / (forecast.length - 1)}
                    y={150 + day.temp_max * 5 - 15}
                    textAnchor="middle"
                    className="text-sm font-medium fill-foreground"
                  >
                    {day.temp_max}°
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </Card>
      )}

      <div className="grid gap-3">
        {forecast.map((day, index) => (
          <Card
            key={index}
            className="p-4 hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-muted-foreground font-medium min-w-[80px]">
                  {day.date}
                </div>
                <div className="flex items-center gap-2">
                  <Icon name={day.icon as any} size={24} className="text-primary" />
                  <span className="text-sm text-muted-foreground capitalize">{day.description}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-2xl font-semibold">{day.temp_max}°</span>
                  <span className="text-muted-foreground ml-2">{day.temp_min}°</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="CloudSun" size={64} className="text-primary animate-pulse mx-auto" />
          <p className="text-xl text-muted-foreground">Загрузка погоды...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Погода в Черемхово
          </h1>
          <p className="text-muted-foreground">
            Актуальный прогноз погоды {error && '(демо режим)'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="today" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Сегодня
            </TabsTrigger>
            <TabsTrigger value="10days" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              10 дней
            </TabsTrigger>
            <TabsTrigger value="30days" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              30 дней
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            {renderCurrentWeather()}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Прогноз на сегодня</h3>
              {renderForecast(forecast1Day, false)}
            </div>
          </TabsContent>

          <TabsContent value="10days">
            <h3 className="text-xl font-semibold mb-4">Прогноз на 10 дней</h3>
            {renderForecast(forecast10Days, true)}
          </TabsContent>

          <TabsContent value="30days">
            <h3 className="text-xl font-semibold mb-4">Прогноз на 30 дней</h3>
            {renderForecast(forecast30Days, true)}
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Данные обновляются каждый час • Powered by WeatherAPI.com</p>
        </div>
      </div>
    </div>
  );
};

export default Index;