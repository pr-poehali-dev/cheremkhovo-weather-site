import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

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

const Index = () => {
  const [activeTab, setActiveTab] = useState('today');

  const currentWeather: WeatherData = {
    temp: -8,
    feels_like: -15,
    humidity: 78,
    wind_speed: 4.2,
    pressure: 1018,
    description: 'Облачно с прояснениями',
    icon: 'Cloud'
  };

  const forecast1Day: ForecastDay[] = [
    { date: '00:00', temp_max: -7, temp_min: -9, description: 'Облачно', icon: 'Cloud' },
    { date: '03:00', temp_max: -9, temp_min: -11, description: 'Облачно', icon: 'Cloud' },
    { date: '06:00', temp_max: -10, temp_min: -12, description: 'Малооблачно', icon: 'CloudSun' },
    { date: '09:00', temp_max: -6, temp_min: -8, description: 'Малооблачно', icon: 'CloudSun' },
    { date: '12:00', temp_max: -4, temp_min: -6, description: 'Ясно', icon: 'Sun' },
    { date: '15:00', temp_max: -5, temp_min: -7, description: 'Малооблачно', icon: 'CloudSun' },
    { date: '18:00', temp_max: -8, temp_min: -10, description: 'Облачно', icon: 'Cloud' },
    { date: '21:00', temp_max: -10, temp_min: -12, description: 'Облачно', icon: 'Cloud' }
  ];

  const forecast10Days: ForecastDay[] = [
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
  ];

  const forecast30Days: ForecastDay[] = Array.from({ length: 30 }, (_, i) => ({
    date: `${18 + i} окт`,
    temp_max: Math.floor(Math.random() * 8) - 8,
    temp_min: Math.floor(Math.random() * 8) - 16,
    description: ['Ясно', 'Облачно', 'Малооблачно', 'Снег'][Math.floor(Math.random() * 4)],
    icon: ['Sun', 'Cloud', 'CloudSun', 'Snowflake'][Math.floor(Math.random() * 4)]
  }));

  const renderCurrentWeather = () => (
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
          <p className="text-xl text-muted-foreground">{currentWeather.description}</p>
          <p className="text-muted-foreground">Ощущается как {currentWeather.feels_like}°</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Wind" size={20} />
            <span className="text-sm">Ветер</span>
          </div>
          <div className="text-3xl font-semibold">{currentWeather.wind_speed} м/с</div>
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

  const renderForecast = (forecast: ForecastDay[], showGraph: boolean = false) => (
    <div className="space-y-6 animate-fade-in">
      {showGraph && (
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
                  <span className="text-sm text-muted-foreground">{day.description}</span>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Погода в Черемхово
          </h1>
          <p className="text-muted-foreground">Актуальный прогноз погоды</p>
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
          <p>Данные обновляются каждый час</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
