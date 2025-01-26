import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';

type HouseFormRowProp = {
  title: string;
  gridClassName: string;
  titleClassName?: string;
  children: React.ReactNode;
};

export default function HouseFormRow({
  title,
  gridClassName,
  titleClassName,
  children,
}: HouseFormRowProp) {
  return (
    <Container.Grid className={`items-start gap-4 ${gridClassName}`}>
      <Typography.SubTitle1 className={`mt-3 text-brown ${titleClassName}`}>
        {title}
      </Typography.SubTitle1>
      {children}
    </Container.Grid>
  );
}

HouseFormRow.defaultProps = {
  titleClassName: '',
};
