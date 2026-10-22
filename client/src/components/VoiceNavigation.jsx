import { useEffect, useRef } from "react";

const VoiceNavigation = ({
  isNavigating,
  steps,
  destination,
}) => {

  const currentStep = useRef(0);

  const speak = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {

    if (!isNavigating) return;

    currentStep.current = 0;

    speak(
      `Navigation started.
       Destination is ${destination}.
       Please follow the instructions.`
    );

  }, [isNavigating]);

  const nextStep = () => {

    if (currentStep.current >= steps.length) {

      speak(
        `Congratulations.
        You have reached ${destination}.`
      );

      return;
    }

    const step = steps[currentStep.current];

    speak(step);

    currentStep.current++;
  };

  const stopNavigation = () => {

    window.speechSynthesis.cancel();

  };

  return {
    nextStep,
    stopNavigation,
  };
};

export default VoiceNavigation;