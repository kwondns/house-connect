import { Outlet, useNavigate } from 'react-router-dom';

import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';

export default function SignUp() {
  const navigate = useNavigate();

  const onClickPrevButton = () => {
    navigate('/sign/in');
  };

  return (
    <Container.FlexCol className="w-full gap-[2.5rem]">
      <IconButton.Ghost
        onClick={onClickPrevButton}
        iconType="back"
        iconClassName="mx-auto"
        className="size-[2.75rem] cursor-pointer rounded-full"
      />
      <Container.FlexCol className="gap-[3.5rem]">
        <Typography.Head2 className="text-brown">회원가입</Typography.Head2>
        <Container className="w-full">
          <Outlet />
        </Container>
      </Container.FlexCol>
    </Container.FlexCol>
  );
}
