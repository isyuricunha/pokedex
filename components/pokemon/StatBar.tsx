import { StatName, STAT_NAMES } from '@/lib/types/pokemon';

interface StatBarProps {
  stat: StatName;
  value: number;
  maxValue?: number;
}

export default function StatBar({ stat, value, maxValue = 255 }: StatBarProps) {
  const percentage = (value / maxValue) * 100;

  // Color based on value
  const getBarColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-lime-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 text-sm font-medium text-text-secondary">
        {STAT_NAMES[stat]}
      </div>
      <div className="flex-1">
        <div className="h-3 bg-bg-secondary rounded-full overflow-hidden border border-border">
          <div
            className={`h-full ${getBarColor()} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="w-12 text-right text-sm font-bold text-text-primary">
        {value}
      </div>
    </div>
  );
}
