
import React from "react";

interface ChartProps {
  data: any[];
  categories?: string[];
  index?: string;
  valueFormatter?: (value: number) => string;
  colors?: string[];
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGridLines?: boolean;
  className?: string;
  height?: number;
}

export const LineChart: React.FC<ChartProps> = ({ 
  data = [], 
  categories = [], 
  index,
  valueFormatter,
  colors = ["#0284c7"],
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  className = "",
  height = 300,
}) => {
  // This is a placeholder component that will be replaced with a real chart library
  return (
    <div className={`w-full h-[${height}px] ${className}`} data-testid="line-chart">
      <div className="text-center text-muted-foreground p-4">
        Line Chart Placeholder - Will integrate with real chart library in production
      </div>
      <div className="flex justify-center gap-4">
        {colors.map((color, i) => (
          <div key={i} className="flex items-center">
            <div className="w-3 h-3 mr-1" style={{ backgroundColor: color }}></div>
            <span className="text-xs">{categories[i] || `Series ${i+1}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BarChart: React.FC<ChartProps> = ({ 
  data = [], 
  categories = [], 
  index,
  valueFormatter,
  colors = ["#0284c7"],
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  className = "",
  height = 300,
}) => {
  // This is a placeholder component that will be replaced with a real chart library
  return (
    <div className={`w-full h-[${height}px] ${className}`} data-testid="bar-chart">
      <div className="text-center text-muted-foreground p-4">
        Bar Chart Placeholder - Will integrate with real chart library in production
      </div>
      <div className="flex justify-center gap-4">
        {colors.map((color, i) => (
          <div key={i} className="flex items-center">
            <div className="w-3 h-3 mr-1" style={{ backgroundColor: color }}></div>
            <span className="text-xs">{categories[i] || `Series ${i+1}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PieChart: React.FC<ChartProps> = ({ 
  data = [], 
  valueFormatter,
  showLegend = true,
  className = "",
  height = 300,
}) => {
  // This is a placeholder component that will be replaced with a real chart library
  return (
    <div className={`w-full h-[${height}px] ${className}`} data-testid="pie-chart">
      <div className="text-center text-muted-foreground p-4">
        Pie Chart Placeholder - Will integrate with real chart library in production
      </div>
      <div className="flex justify-center gap-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center">
            <div className="w-3 h-3 mr-1" style={{ backgroundColor: item.fill || '#0284c7' }}></div>
            <span className="text-xs">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
