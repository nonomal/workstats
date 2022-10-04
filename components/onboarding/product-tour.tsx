import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
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
  // Workaround for the popup position of the first step to poke through to the upper left and not center correctly when transitioning from another page. Reloading is not a problem.
  const [stepEnabled, setStepEnabled] = useState(false);
  useEffect(() => {
    if (numberOfOnboardingTimes === 0) setStepEnabled(true);
  }, [numberOfOnboardingTimes]);

  const [numberOfTimesCompleted, setNumberOfTimesCompleted] = useState(
    numberOfOnboardingTimes
  );
  const onExit = async (stepIndex: number) => {
    // If you exit the tour in any way, you must assign stepEnabled = false, otherwise the tour will not start when you press the "Start Tutorial" button
    setStepEnabled(false);

    // It should be compared to steps.length -1, but at least in Windows, there is a weird quirk in the way the library counts indexes, so when there are n steps, the index just before Exit is somehow n.
    // In iOS, like Mac PC, iPad, and iPhone, stepIndex will be 'n - 1'.
    if (stepIndex === steps.length || stepIndex === steps.length - 1) {
      const newNumberOfTimesCompleted = numberOfTimesCompleted + 1;
      setNumberOfTimesCompleted(newNumberOfTimesCompleted);
      await handleSubmitProductTour(
        docId,
        productTourName,
        newNumberOfTimesCompleted
      );
    }

    // Go to the user settings page in another tab, which is the next thing to do
    if (window.location.pathname === '/dashboard')
      // eslint-disable-next-line quotes
      confirm("Let's set it up right away!") &&
        window.open('/user-settings', '_blank');
  };
  const onBeforeExit = (stepIndex: number) => {
    // For some reason, onExit is called when index = 0, and because of that, for some reason, step 1 is displayed twice, so prevent it. Instead, users cannot leave by pressing the escape button or off-screen during the first pop-up
    // Also added undefined. Couldn't figure out why, but it makes the behavior more stable.
    if (stepIndex === undefined || stepIndex === 0) return false;
    return;
  };
  // For testing purposes
  // const onAfterChange = (newStepIndex: number) => {
  //   console.log({ newStepIndex });
  // };
  const handleClick = () => {
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
      <StartTutorial label='Start Tutorial' handleClick={handleClick} />
    </>
  );
};

export default Onboarding;
