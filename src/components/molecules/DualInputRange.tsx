import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import InputRange, { Track } from '@/components/atoms/InputRange';
import Container from '@/components/atoms/Container';
import cn from '@/libs/cn';
import getGradientStop from '@/libs/getGradientStop';

export type InputRangeState = [number, number];

export type DualInputRangeType = {
  min: number;
  max: number;
  step: number;
  rangeValue: InputRangeState;
  setRangeValue: Dispatch<SetStateAction<InputRangeState>>;
  className?: string;
};

type MinMax = 'min' | 'max';

export default function DualInputRange({
  min = 0,
  max = 100,
  step = 1,
  rangeValue,
  setRangeValue,
  className = '',
}: DualInputRangeType) {
  // * ensure range.min < range.max function
  const validateRangeValue =
    (type: MinMax, value: number) =>
    (prev: InputRangeState): InputRangeState =>
      type === 'min'
        ? [Math.min(Number(value), prev[1]), prev[1]]
        : [prev[0], Math.max(Number(value), prev[0])];

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>, type: MinMax) => {
    const { value } = e.currentTarget;
    return setRangeValue(validateRangeValue(type, Number(value)));
  };

  const minGradientStopPoint = getGradientStop(rangeValue[0], min, max + step);
  const maxGradientStopPoint = getGradientStop(rangeValue[1], min, max + step);

  const minDuplicateStyle =
    rangeValue[0] === rangeValue[1] && rangeValue[0] === min + step
      ? '[&_#min]:invisible'
      : '';

  const maxDuplicateStyle =
    rangeValue[0] === rangeValue[1] && rangeValue[0] === max + step
      ? '[&_#max]:invisible'
      : '';
  return (
    <Container.Grid
      className={cn(
        'w-full grid-cols-1 grid-rows-1 items-center justify-items-center [&>*]:col-start-1 [&>*]:row-start-1',
        minDuplicateStyle,
        maxDuplicateStyle,
        className,
      )}
    >
      <Track stopPoints={[minGradientStopPoint, maxGradientStopPoint]} />
      <InputRange
        id="min"
        min={min}
        max={max}
        step={step}
        value={rangeValue[0]}
        onChange={e => onChangeInput(e, 'min')}
        overlap
      />
      <InputRange
        id="max"
        min={min}
        max={max}
        step={step}
        value={rangeValue[1]}
        onChange={e => onChangeInput(e, 'max')}
        overlap
      />
    </Container.Grid>
  );
}

DualInputRange.defaultProps = {
  className: '',
};
