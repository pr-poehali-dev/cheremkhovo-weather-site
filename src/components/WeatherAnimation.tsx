import { useEffect, useState } from 'react';

interface WeatherAnimationProps {
  condition: string;
  isNight?: boolean;
}

const WeatherAnimation = ({ condition, isNight = false }: WeatherAnimationProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const lowerCondition = condition.toLowerCase();
    let particleCount = 0;

    if (lowerCondition.includes('снег') || lowerCondition.includes('метель')) {
      particleCount = 50;
    } else if (lowerCondition.includes('дожд')) {
      particleCount = 100;
    }

    if (particleCount > 0) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [condition]);

  const renderSnow = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-fall"
          style={{
            left: `${particle.x}%`,
            top: '-10px',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full opacity-80 shadow-lg" />
        </div>
      ))}
    </div>
  );

  const renderRain = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-rain"
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        >
          <div className="w-0.5 h-4 bg-blue-400 opacity-60" />
        </div>
      ))}
    </div>
  );

  const renderWind = () => {
    const lowerCondition = condition.toLowerCase();
    if (!lowerCondition.includes('ветр') && !lowerCondition.includes('метель')) return null;

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-wind"
            style={{
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          >
            <div className="w-12 h-0.5 bg-white/30 rounded-full" />
          </div>
        ))}
      </div>
    );
  };

  const lowerCondition = condition.toLowerCase();
  const hasSnow = lowerCondition.includes('снег') || lowerCondition.includes('метель');
  const hasRain = lowerCondition.includes('дожд');

  return (
    <>
      {hasSnow && renderSnow()}
      {hasRain && renderRain()}
      {renderWind()}
    </>
  );
};

export default WeatherAnimation;
