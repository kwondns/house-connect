import { useEffect } from 'react';

import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import HouseRegisterTemplate from '@/components/templates/HouseRegisterTemplate';

export default function HouseRegister() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Container.FlexCol className="mt-[4rem]">
        <Typography.Head2 className="mb-[5rem] text-brown">
          하우스 등록
        </Typography.Head2>
      </Container.FlexCol>
      <HouseRegisterTemplate />
    </div>
  );
}
