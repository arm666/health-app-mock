import React, { useState } from 'react';
import { Brain, Sparkles, X, MessageCircle, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AIFloatingButtonProps {
  onAIAssistant?: () => void;
}

export default function AIFloatingButton({ onAIAssistant }: AIFloatingButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    if (onAIAssistant) {
      onAIAssistant();
    } else {
      // Toggle expanded state if no handler provided
      setIsExpanded(!isExpanded);
    }
  };

  const quickActions = [
    {
      title: 'Health Check',
      description: 'Analyze your health data',
      icon: Zap,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Medication Help',
      description: 'Ask about your medications',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Symptom Checker',
      description: 'Describe your symptoms',
      icon: Brain,
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Quick Actions Menu */}
      {isExpanded && (
        <div className="fixed bottom-24 right-4 z-50 space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="flex items-center space-x-2 animate-in slide-in-from-bottom-5 duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="shadow-lg border-0">
                  <CardContent className="p-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Button
                  size="sm"
                  className={`w-12 h-12 rounded-full shadow-lg ${action.color} text-white`}
                  onClick={() => {
                    setIsExpanded(false);
                    // Handle specific action
                    console.log(`AI Action: ${action.title}`);
                  }}
                >
                  <Icon size={20} />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main AI Button */}
      <div className="fixed bottom-20 right-4 z-50">
        <div className="relative">
          {/* Pulsing ring animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 opacity-20 animate-ping" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-md" />
          
          {/* Main button */}
          <Button
            onClick={handleClick}
            className={`relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl border-0 transition-all duration-300 ${
              isAnimating ? 'scale-110' : 'scale-100'
            } ${isExpanded ? 'rotate-45' : 'rotate-0'}`}
          >
            {isExpanded ? (
              <X size={24} className="text-white" />
            ) : (
              <div className="relative">
                <Brain size={20} className="text-white" />
                <Sparkles 
                  size={12} 
                  className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" 
                />
              </div>
            )}
          </Button>
          
          {/* AI Label */}
          {!isExpanded && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                AI Assistant
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}