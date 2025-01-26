import { ComponentProps } from 'react';

import cn from '@/libs/cn';
import Container from '@/components/atoms/Container';
import getGradientStop from '@/libs/getGradientStop';
import tailwindConfig from '../../../tailwind.config';

type InputRangeProps = ComponentProps<'input'> & {
  min: number;
  max: number;
  value: number;
  step: number;
  overlap?: boolean;
};

type TrackType = {
  stopPoints: [number, number | undefined | null];
};

const { brown: accentTrackColor, brown2: noneAccentTrackColor } =
  tailwindConfig.theme.extend.colors;
export function Track({ stopPoints }: TrackType) {
  const [stopPoint1, stopPoint2] = stopPoints;
  const stopPointStyle = !stopPoint2
    ? `${accentTrackColor} 0%,
  ${accentTrackColor} ${stopPoint1}%,
  ${noneAccentTrackColor} ${stopPoint1}%,
  ${noneAccentTrackColor} 100%`
    : `${noneAccentTrackColor} 0%,
  ${noneAccentTrackColor} ${stopPoint1}%,
  ${accentTrackColor} ${stopPoint1}%,
  ${accentTrackColor} ${stopPoint2}%,
  ${noneAccentTrackColor} ${stopPoint2}%,
  ${noneAccentTrackColor} 100%`;

  return (
    <div
      className="relative h-[0.4375rem] w-full rounded-lg"
      style={{
        backgroundImage: `linear-gradient(
      to right,
      ${stopPointStyle})`,
      }}
    />
  );
}

// ! create stacking context by adding transform property in order to thumb's position to top of z-order
// ! alternative => opacity, z-index
const inputThumbStyle =
  'slider-thumb:appearance-none slider-thumb:size-6 slider-thumb:rounded-full slider-thumb:bg-bg slider-thumb:ring-1 slider-thumb:ring-brown  slider-thumb:hover:bg-brown4 slider-thumb:hover:ring-2 slider-thumb:hover:ring-offset-2 slider-thumb:hover:ring-brown1 slider-thumb:cursor-pointer slider-thumb:pointer-events-auto slider-thumb:translate-y-0';
const inputTrackStyle = 'slider-track:appearance-auto';

export default function InputRange({
  min = 0,
  max = 100,
  step = 1,
  onChange,
  value = 0,
  className,
  overlap = false,
  ...others
}: InputRangeProps) {
  const oneStepHigherValue = max + step;
  const stopPoint = getGradientStop(value, min, oneStepHigherValue);

  return (
    <Container.Grid
      className={cn(
        'w-full grid-cols-1 grid-rows-1 items-center justify-items-center [&>*]:col-start-1 [&>*]:row-start-1',
        className,
      )}
    >
      {!overlap && <Track stopPoints={[stopPoint, null]} />}
      <input
        className={`pointer-events-none w-full appearance-none bg-transparent ${cn(inputThumbStyle, inputTrackStyle, className)}`}
        onChange={onChange}
        type="range"
        min={min}
        max={oneStepHigherValue}
        step={step}
        value={value}
        {...others}
      />
    </Container.Grid>
  );
}

InputRange.defaultProps = {
  overlap: false,
};
