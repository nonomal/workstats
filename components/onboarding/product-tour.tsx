import dynamic from 'next/dynamic';
import { useState } from 'react';
import { handleSubmitProductTour } from '../../services/setDocToFirestore';
import StartTutorial from './start-tutorial';

// Intro.js, see the details here: https://introjs.com/
// Intro.js-react, see the details here: https://github.com/HiDeoo/intro.js-react
// @ts-ignore
const Steps = dynamic(() => import('intro.js-react').then((mod) => mod.Steps), {
  ssr: false
});

interface OnboardingProps {
  docId: string;
  steps: Array<{
    intro: string;
    element?: string;
    title?: string;
    position?:
      | 'auto'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'top-left-aligned'
      | 'top-middle-aligned'
      | 'top-right-aligned'
      | 'bottom-left-aligned'
      | 'bottom-middle-aligned'
      | 'bottom-right-aligned';
  }>;
  productTourName: string;
  numberOfOnboardingTimes: number;
}

const Onboarding = ({
  docId,
  steps,
  productTourName,
  numberOfOnboardingTimes
}: OnboardingProps) => {
  const [stepEnabled, setStepEnabled] = useState(numberOfOnboardingTimes === 0);
  const [numberOfTimesCompleted, setNumberOfTimesCompleted] = useState(
    numberOfOnboardingTimes
  );
  const onExit = async (stepIndex: number) => {
    // It should be compared to steps.length -1, but at least in Windows, there is a weird quirk in the way the library counts indexes, so when there are n steps, the index just before Exit is somehow n.
    // In iOS, like Mac PC, iPad, and iPhone, stepIndex will be 'n - 1'.
    if (stepIndex === steps.length || stepIndex === steps.length - 1) {
      setStepEnabled(false);
      const newNumberOfTimesCompleted = numberOfTimesCompleted + 1;
      setNumberOfTimesCompleted(newNumberOfTimesCompleted);
      await handleSubmitProductTour(
        docId,
        productTourName,
        newNumberOfTimesCompleted
      );
    }
  };
  const onBeforeExit = (stepIndex: number) => {
    // For some reason, onExit is called when index = 0, and because of that, for some reason, step 1 is displayed twice, so prevent it. Instead, users cannot leave by pressing the escape button or off-screen during the first pop-up
    if (stepIndex === 0) return false;
    return true;
  };
  // For testing purposes
  // const onAfterChange = (newStepIndex: number) => {
  //   console.log({ newStepIndex });
  // };
  const onStart = () => {
    // If stepEnabled remains true for some reason, the product tour cannot be restarted again, so force it to be false once and then set it to true.
    if (stepEnabled === true) {
      setStepEnabled(false);
      setStepEnabled(true);
    }
    setStepEnabled(true);
  };
  const options = {
    showProgress: true, // Default is false
    showBullets: true, // Default is true
    showStepNumbers: true, // Default is true
    showButtons: true, // Default is true
    keyboardNavigation: true,
    exitOnOverlayClick: true,
    exitOnEsc: true,
    nextLabel: 'Next',
    prevLabel: 'Prev',
    // skipLabel: 'Skip',
    hidePrev: true,
    doneLabel: 'Done',
    overlayOpacity: 0.5,
    overlayColor: '#000',
    // tooltipPosition: 'auto',
    scrollToElement: true, // Default is true
    scrollTo: 'tooltip', // Default is 'element'
    helperElementPadding: 10
  };

  return (
    <>
      <Steps
        // @ts-ignore
        enabled={stepEnabled} // Default is false
        steps={steps}
        initialStep={0} // Step index to start with when showing the steps.
        onExit={onExit}
        onBeforeExit={onBeforeExit}
        // onAfterChange={onAfterChange}
        options={options}
      />
      <StartTutorial label='Start Tutorial' handleClick={onStart} />
    </>
  );
};

export default Onboarding;