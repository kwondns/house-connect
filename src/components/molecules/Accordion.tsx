import { useState } from 'react';

import Container from '@/components/atoms/Container';
import Button from '@/components/atoms/Button';
import Typography from '@/components/atoms/Typography';
import Icon from '@/components/atoms/Icon';

type AccordionProps = {
  title: string;
  guideline?: string;
  children: React.ReactNode;
  accordionButtonStyle?: string;
  titleStyle?: string;
  guideStyle?: string;
  openContainerStyle?: string;
};

export default function Accordion({
  accordionButtonStyle,
  title,
  titleStyle,
  guideline,
  guideStyle,
  children,
  openContainerStyle,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Container.FlexCol className="w-full">
      <Button.Ghost onClick={toggleAccordion} className={accordionButtonStyle}>
        <Container.FlexRow className="items-center pb-10">
          {!isOpen ? (
            <Icon type="close-triangle" className="mb-1 mr-5" />
          ) : (
            <Icon type="open-triangle" className="mb-0.5 mr-5" />
          )}
          <Container.FlexRow className="flex-wrap items-center gap-5">
            <Typography.Head3 className={titleStyle}>{title}</Typography.Head3>
            <Typography.P2 className={guideStyle}>{guideline}</Typography.P2>
          </Container.FlexRow>
        </Container.FlexRow>
      </Button.Ghost>
      {isOpen && (
        <Container.FlexCol className={openContainerStyle}>
          {children}
        </Container.FlexCol>
      )}
    </Container.FlexCol>
  );
}

Accordion.defaultProps = {
  guideline: '',
  accordionButtonStyle: '',
  titleStyle: '',
  guideStyle: '',
  openContainerStyle: '',
};
