import { formatCurrency, formatPercentage, getChangeColorClass } from '@/utils/stock-utils';
import { StockSummary } from '@/types/stock';

interface StockCardProps {
  stock: StockSummary;
  onClick?: () => void;
}

export default function StockCard({ stock, onClick }: StockCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">
              {stock.symbol}
            </h3>
            <div className={`w-2 h-2 rounded-full ${stock.isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          <p className="text-sm text-gray-600 truncate">
            {stock.companyName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(stock.currentPrice)}
          </p>
          <p className={`text-sm font-medium ${getChangeColorClass(stock.change)}`}>
            {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
          </p>
          <p className={`text-xs ${getChangeColorClass(stock.change)}`}>
            {stock.change >= 0 ? '+' : ''}{formatPercentage(stock.changePercent)}
          </p>
        </div>
      </div>
      
      {/* Mini Chart Placeholder */}
      <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all">
        <span className="text-xs text-gray-500">
          Chart coming soon
        </span>
      </div>
    </div>
  );
}
