import DualInputRange, {
  DualInputRangeType,
} from '@/components/molecules/DualInputRange';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import unitConverters from '@/libs/generateUnit';
import cn from '@/libs/cn';

type LabelDualInputRangeProps = DualInputRangeType & {
  label?: string;
  category: 'price' | 'term';
  labelContainerStyle?: string;
  rulerStyle?: string;
};
export default function LabelDualInputRange(props: LabelDualInputRangeProps) {
  const {
    label,
    category,
    rangeValue,
    labelContainerStyle,
    min,
    max,
    className,
    rulerStyle,
    ...others
  } = props;
  const [rangeMinValue, rangeMaxValue] = [
    unitConverters[category](rangeValue[0], max),
    unitConverters[category](rangeValue[1], max),
  ];
  const [rangeMinRulerValue, rangeMidRulerValue, rangeMaxRulerValue] = [
    unitConverters[category](min, max),
    unitConverters[category](Math.floor((min + max) / 2), max),
    unitConverters[category](max, max),
  ];

  return (
    <Container.FlexCol className={className}>
      <Container.FlexRow
        className={cn('mb-7 justify-between', labelContainerStyle)}
      >
        {label && (
          <Typography.SubTitle2 className="font-medium text-brown">
            {label}
          </Typography.SubTitle2>
        )}
        <Typography.SubTitle2 className="font-medium text-brown">
          {rangeMinValue === rangeMaxValue
            ? rangeMinValue
            : `${rangeMinValue} ~ ${rangeMaxValue}`}
        </Typography.SubTitle2>
      </Container.FlexRow>
      <DualInputRange
        className="mb-2"
        min={min}
        max={max}
        rangeValue={rangeValue}
        {...others}
      />
      <Container.FlexRow
        className={cn('relative justify-between text-brown', rulerStyle)}
      >
        <Typography.Span1 className="">{rangeMinRulerValue}</Typography.Span1>
        <Typography.Span1 className="">{rangeMidRulerValue}</Typography.Span1>
        <Typography.Span1 className="">
          {`${rangeMaxRulerValue} 이상`}
        </Typography.Span1>
        {/* <Typography.Span1 className="absolute left-0 top-0">
          {rangeMinRulerValue}
        </Typography.Span1>
        <Typography.Span1 className="absolute left-1/2 top-0 -translate-x-2/3">
          {rangeMidRulerValue}
        </Typography.Span1>
        <Typography.Span1 className="absolute right-[0.75rem] top-0 translate-x-1/4">{`${rangeMaxRulerValue} 이상`}</Typography.Span1> */}
      </Container.FlexRow>
    </Container.FlexCol>
  );
}

LabelDualInputRange.defaultProps = {
  label: null,
  labelContainerStyle: '',
  rulerStyle: '',
};
