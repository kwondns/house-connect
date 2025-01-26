import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import cn from '@/libs/cn';

type NewChatCountCircleType = {
  content: number;
  containerStyle?: string;
  typoStyle?: string;
};

export default function NewChatCountCircle({
  content,
  containerStyle,
  typoStyle,
}: NewChatCountCircleType) {
  return content > 0 ? (
    <Container.FlexRow
      className={cn(
        'w-fit items-center justify-center rounded-full bg-point pl-2 pr-[0.4375rem] pt-[0.25rem] pb-[0.3125rem]',
        containerStyle,
      )}
    >
      <Typography.Span2 className={cn('font-semibold text-bg', typoStyle)}>
        {content}
      </Typography.Span2>
    </Container.FlexRow>
  ) : null;
}

NewChatCountCircle.defaultProps = {
  containerStyle: '',
  typoStyle: '',
};
