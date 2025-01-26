import { ComponentProps, useState } from 'react';
import { SetterOrUpdater } from 'recoil';

import Container from '@/components/atoms/Container';
import SelectorItem from '@/components/atoms/SelectorItem';
import cn from '@/libs/cn';
import IconButton from '@/components/molecules/IconButton';
import { SelectorStateType } from '@/components/organisms/districtSelector/selector.store';
import {
  SelectorContentsType,
  SelectorItemValueType,
  SelectorLabelType,
} from '@/types/regionDistrict.type';

type SelectorProps<Label extends SelectorLabelType> = Omit<
  ComponentProps<'button'>,
  'onClick'
> & {
  label: Label;
  contents: SelectorContentsType<Label>;
  state?: SelectorStateType<Label>;
  setState?: SetterOrUpdater<SelectorStateType<Label>>;
  onClick?: (content: SelectorItemValueType<Label>) => void;
};

const selectorContainerStyle =
  'relative w-full items-center justify-between text-[1.125rem] text-brown';
export default function Selector<Label extends SelectorLabelType>({
  label,
  contents,
  className,
  onClick,
  state,
  setState,
}: SelectorProps<Label>) {
  // * Selector가 독집적으로 사용될 때는 제어권을 외부가 아닌 현재 컴포넌트가 가져 instance화 시 전역상태를 공유하지 않게 됨
  const [innerState, setInnerState] = useState<SelectorStateType<Label>>({
    value: label,
    isOpen: false,
  });

  // * props받는 값이 있는지 없는지 셈
  const propsFromParent = [state, setState, onClick];
  /*
   * 0: Selector가 독립적으로 사용되어 부모로부터 props(contents제외)로 받지 않을 때
   * 아래는 독립적인 아닌 DistrictSelector에서 사용되는 경우
   * [1, 2]: 부모로부터 하나라도 받는 값이 있지만 undefined가 하나라도 있을 때
   * 3: 모든 props를 부모로부터 받을 때
   */
  const takenPropsFromParentCount = propsFromParent.reduce(
    (acc, cur) => acc + +!!cur,
    0,
  );

  // ! props를 중 한개라도 값이 있으면서 나머지는 undefined일 때 => occur error
  if (
    takenPropsFromParentCount > 0 &&
    takenPropsFromParentCount < propsFromParent.length
  )
    throw new Error(
      `All props(state, setState, onClick) must be provided by the parent component, or none at all.`,
    );

  // * 외부에 제어권(state & setState & onClick)이 있을 때
  const { value, isOpen } = state ?? innerState;
  const setSelectorState = setState ?? setInnerState;
  const onClickSelectorItem =
    onClick ??
    ((content: SelectorItemValueType<Label>) => {
      setSelectorState(prev => ({ ...prev, value: content, isOpen: false }));
    });

  return (
    <Container.FlexCol className={cn(selectorContainerStyle, className)}>
      <IconButton
        iconType="expand-arrow"
        button="Ghost"
        onClick={() =>
          setSelectorState(prev => ({ ...prev, isOpen: !prev.isOpen }))
        }
        className="flex w-full items-center justify-between border border-brown bg-bg p-5 text-brown"
      >
        {value}
      </IconButton>
      {isOpen && (
        <Container.FlexCol className="absolute left-0 top-full z-10 max-h-56 w-full overflow-scroll border-x border-b border-brown text-brown5">
          {contents?.map(content => (
            <SelectorItem
              onClick={() =>
                onClickSelectorItem(content as SelectorItemValueType<Label>)
              }
              key={content}
              className={content === value ? 'bg-brown3' : ''}
            >
              {content}
            </SelectorItem>
          ))}
        </Container.FlexCol>
      )}
    </Container.FlexCol>
  );
}

// ! undefined가 아닌
// ! 함수: () => {} 또는 state: {value: '', isOpen: false}
// ! 와 같이 하면 ?? 연산자를 통해 외부 제어권 props들을 검사하기 힘들어져 undefined로 선언
Selector.defaultProps = {
  onClick: undefined,
  state: undefined,
  setState: undefined,
};
