import { getChangeColorClass } from '@/utils/stock-utils';

interface MarketIndex {
  name: string;
  value: string;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

interface MarketIndexCardProps {
  index: MarketIndex;
}

export default function MarketIndexCard({ index }: MarketIndexCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">
          {index.name}
        </h3>
        <div className={`w-2 h-2 rounded-full ${index.isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
      <p className="text-xl font-bold text-gray-900 mb-1">
        {index.value}
      </p>
      <p className={`text-sm font-medium ${getChangeColorClass(index.change)}`}>
        {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
      </p>
    </div>
  );
}
