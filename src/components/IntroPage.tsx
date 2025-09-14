import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Users } from 'lucide-react';

interface IntroPageProps {
  onComplete: () => void;
}

const IntroPage = ({ onComplete }: IntroPageProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(onComplete, 1000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  const steps = [
    { icon: Building2, text: "CivicConnect", color: "text-civic-blue" },
    { icon: MapPin, text: "Report Issues", color: "text-civic-green" },
    { icon: Users, text: "Build Community", color: "text-civic-amber" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20"
    >
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            {steps[currentStep] && (
              <>
                <div className={`p-6 rounded-full bg-background/50 backdrop-blur-sm ${steps[currentStep].color}`}>
                  {React.createElement(steps[currentStep].icon, { size: 48 })}
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {steps[currentStep].text}
                </h2>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className="flex gap-2 mt-8 justify-center">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default IntroPage;