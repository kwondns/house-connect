import { useEffect } from 'react';

import loadingHouse from '@/assets/images/loading-house.gif';
import Img from '@/components/atoms/Img';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import cn from '@/libs/cn';

type LoadingType = {
  delayTime?: number;
  setIsDelaying?: React.Dispatch<React.SetStateAction<boolean>>;
  text?: string;
  textStyle?: string;
};

export default function Loading({
  delayTime,
  setIsDelaying,
  text,
  textStyle,
}: LoadingType) {
  useEffect(() => {
    let sleep: number | undefined;

    if (delayTime && setIsDelaying) {
      sleep = window.setTimeout(() => {
        setIsDelaying(false);
      }, delayTime);
    }

    return () => {
      if (sleep) clearTimeout(sleep);
    };
  }, []);

  return (
    // ! TODO: Loading Page Figma나오면 작업 들어가기
    <Container.FlexCol className="flex h-screen items-center justify-center gap-[4.25rem]">
      <Img
        src={loadingHouse}
        className="h-[18rem] w-[15.375rem]"
        alt="loading house gif"
      />
      <Typography.SubTitle1
        lang="en"
        className={cn('uppercase tracking-wide text-point', textStyle)}
      >
        {text}
      </Typography.SubTitle1>
    </Container.FlexCol>
  );
}

Loading.defaultProps = {
  delayTime: 0,
  setIsDelaying: false,
  text: 'Loading...',
  textStyle: '',
};
