import { useEffect, useRef, useState } from 'react';
import ProgressBar from 'progressbar.js';
import Circle from 'progressbar.js/circle';

// Interface for ProgressCircle component props
interface ProgressCircleProps {
  // id: string;
  progress: number; // Range: 0 - 100
  size: number;
  strokeWidth?: number; // Default: 1.0. Unit is percentage of SVG canvas' size.
  color?: string; // Default: '#555'. Stroke color.
  trailColor?: string; // Default: '#eee'. Trail color.
}

// Progress circle React functional component
const ProgressCircle = (props: ProgressCircleProps) => {
  const { progress, size, strokeWidth, color, trailColor } = props;
  // const { id, progress, size, strokeWidth, color, trailColor } = props;
  const circleRef = useRef(null);
  const [circle, setCircle] = useState<Circle>();

  useEffect(() => {
    // console.log('circleRef.current', circleRef.current);
    const circle = new ProgressBar.Circle(circleRef.current, {
      // Options
      strokeWidth: strokeWidth || 1.0,
      easing: 'easeInOut', // Easing for animation, default: 'linear'
      duration: 1400, // Duration for animation in milliseconds, default: 800
      color: color || '#555',
      trailColor: trailColor || '#eee',
      trailWidth: strokeWidth || 1.0, // Default: Same as stroke width
      svgStyle: null, // or { display: 'block', width: '100%' }

      // Show progress % in the middle of the progress circle
      text: {
        autoStyleContainer: false // Default: true. False to show text in the middle of the progress circle.
      },
      step: (_state, circle) => {
        const value = Math.round(circle.value() * 100);
        // @ts-ignore
        circle.setText(`${value}%`);
      }
    });

    // Set circle state
    setCircle(circle);
  }, [size, strokeWidth, color, trailColor]);

  // Update progress circle with new progress value
  useEffect(() => {
    // .set or .animate to show progress
    if (circle) circle.set(progress / 100); // Range: 0.0 - 1.0
  }, [progress, circle]);

  return (
    <div
      // id={id}
      ref={circleRef}
      style={{
        width: size,
        height: size
      }}
      className={'absolute flex justify-center items-center'}
    />
  );
};

export default ProgressCircle;
