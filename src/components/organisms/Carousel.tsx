import React, { useEffect, useRef } from 'react';

import Container from '@/components/atoms/Container';

type CarouselProps = {
  children: React.ReactNode;
  order: number;
};
export default function Carousel(props: CarouselProps) {
  const { children, order } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const carouselChildrenList = containerRef.current?.querySelectorAll('*');
    carouselChildrenList?.forEach(element =>
      element.setAttribute('tabindex', '-1'),
    );
  }, [containerRef]);

  const translateX = `-translate-x-[${order * 100}%]`;
  return (
    <Container.FlexRow className="w-full overflow-hidden overflow-y-scroll">
      <Container.FlexRow
        className={`w-full transition ${translateX}`}
        ref={containerRef}
      >
        {children}
      </Container.FlexRow>
    </Container.FlexRow>
  );
}
