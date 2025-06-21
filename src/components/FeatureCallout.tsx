
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCalloutProps {
  title: string;
  description: string;
  variant?: 'default' | 'info' | 'success' | 'warning';
  className?: string;
  defaultExpanded?: boolean;
}

const FeatureCallout = ({ 
  title, 
  description, 
  variant = 'default',
  className,
  defaultExpanded = false
}: FeatureCalloutProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const variantStyles = {
    default: 'bg-purple-900/20 border-purple-800/30',
    info: 'bg-blue-900/20 border-blue-800/30',
    success: 'bg-green-900/20 border-green-800/30',
    warning: 'bg-orange-900/20 border-orange-800/30'
  };

  const iconColors = {
    default: 'text-purple-400',
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-orange-400'
  };

  return (
    <Card className={cn(
      "backdrop-blur-xl transition-all duration-200",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className={cn("w-4 h-4", iconColors[variant])} />
            <span className="text-sm font-medium text-white">{title}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 hover:bg-white/10"
          >
            {isExpanded ? (
              <ChevronUp className="w-3 h-3 text-gray-300" />
            ) : (
              <ChevronDown className="w-3 h-3 text-gray-300" />
            )}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-xs text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureCallout;
