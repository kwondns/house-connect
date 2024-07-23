import { KeyboardEvent, useState } from 'react';

import { HouseRegisterFormType } from '@/components/templates/HouseRegisterTemplate1';
import { SignUpProfileFormType } from '@/types/signUp.type';
import {
  matesGenderDisplayData,
  registPetDisplayData,
} from '@/constants/houseData';
import {
  mateNumberDisplayData,
  smokeDisplayData,
} from '@/constants/signUpProfileData';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import BadgeButton from '@/components/molecules/BadgeButton';
import LabelDualInputRange from '@/components/organisms/LabelDualInputRange';
import BadgeButtons from '@/components/molecules/BadgeButtons';
import Accordion from '@/components/molecules/Accordion';
import {
  UserLifeStyleType,
  UserMateStyleType,
} from '@/components/pages/HouseRegister';

export default function HouseRegisterTemplates2({
  form,
}: HouseRegisterFormType) {
  const [preferAge, setPreferAge] = useState<
    UserMateStyleType['prefer_mate_age']
  >([0, 30]);

  const onClickMatesNum = (stateValue: SignUpProfileFormType['mates_number']) =>
    form.setValue('mates_num', stateValue);

  const onClickGenderType = (stateValue: SignUpProfileFormType['gender']) =>
    form.setValue('mate_gender', stateValue);

  const [mateAppeal, setMateAppeal] = useState('');
  const [myAppeal, setMyAppeal] = useState('');

  const onChangeAppeal = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.name === 'mateAppeals') {
      setMateAppeal(e.currentTarget.value);
    } else if (e.currentTarget.name === 'myAppeals') {
      setMyAppeal(e.currentTarget.value);
    }
  };

  const createBadge = (part: string) => {
    if (part === 'mateAppeals') {
      const mateAppeals = form.getValues('mate_appeal');
      if (!mateAppeals.includes(mateAppeal) && mateAppeal !== '') {
        mateAppeals.push(mateAppeal);
        form.setValue('mate_appeal', mateAppeals);
        setMateAppeal('');
      }
    } else if (part === 'myAppeals') {
      const myAppeals = form.getValues('appeals');
      if (!myAppeals.includes(myAppeal) && myAppeal !== '') {
        myAppeals.push(myAppeal);
        form.setValue('appeals', myAppeals);
        setMyAppeal('');
      }
    }
  };

  const pressEnterCreateBadge = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (e.currentTarget.name === 'mateAppeals') {
        createBadge(e.currentTarget.name);
      } else if (e.currentTarget.name === 'myAppeals') {
        createBadge(e.currentTarget.name);
      }
    }
  };

  const onDeleteAppealBadge = (appealContent: string) => {
    const mateAppeals = form.watch('mate_appeal');
    const myAppeals = form.watch('appeals');

    if (mateAppeals.includes(appealContent)) {
      const appeals = mateAppeals.filter(appeal => appeal !== appealContent);
      form.setValue('mate_appeal', appeals);
    } else if (myAppeals.includes(appealContent)) {
      const appeals = myAppeals.filter(appeal => appeal !== appealContent);
      form.setValue('appeals', appeals);
    }
  };

  const onClickSmokingType = (stateValue: UserLifeStyleType['smoking']) =>
    form.setValue('smoking', stateValue);

  const onClickPetType = (stateValue: UserLifeStyleType['pet']) =>
    form.setValue('pet', stateValue);

  return (
    <Container.FlexCol className="mt-8 min-w-full flex-1">
      <Container.FlexCol className="min-w-[13rem] max-w-[75rem]">
        <Typography.Head3 className="mb-10 text-brown">
          원하는 룸메이트
        </Typography.Head3>
        <Container.FlexCol className="gap-[5.5rem]">
          <Container.Grid className="items-start gap-4 sm:grid-cols-[12.8125rem_auto]">
            <Typography.SubTitle1 className="mt-3 text-brown">
              성별
            </Typography.SubTitle1>
            <Container.FlexRow className="mb-4 gap-2">
              {matesGenderDisplayData.map(
                ({ displayValue, stateValue, iconType }) => (
                  <BadgeButton.Outline
                    key={displayValue}
                    className="h-10 gap-2 rounded-full px-4"
                    badgeActive={stateValue === form.watch('mate_gender')}
                    iconType={iconType}
                    direction="left"
                    onClick={() => onClickGenderType(stateValue)}
                  >
                    <Typography.P2>{displayValue}</Typography.P2>
                  </BadgeButton.Outline>
                ),
              )}
            </Container.FlexRow>
          </Container.Grid>
          <Container.Grid className="items-start gap-4 sm:grid-cols-[12.8125rem_auto]">
            <Typography.SubTitle1 className="mt-3 text-brown">
              원하는 인원 수
            </Typography.SubTitle1>
            <Container.FlexRow className="mb-4 gap-2">
              {mateNumberDisplayData.map(({ displayValue, stateValue }) => (
                <BadgeButton.Outline
                  key={displayValue}
                  className="h-10 rounded-full px-5"
                  onClick={() => onClickMatesNum(stateValue)}
                  badgeActive={stateValue === form.watch('mates_num')}
                >
                  <Typography.P2>{displayValue}</Typography.P2>
                </BadgeButton.Outline>
              ))}
            </Container.FlexRow>
          </Container.Grid>
          <Container.Grid className="items-start gap-4 sm:grid-cols-[12.8125rem_auto]">
            <Typography.SubTitle1 className="mt-3 text-brown">
              원하는 나이
            </Typography.SubTitle1>
            <Container.FlexCol>
              <LabelDualInputRange
                className=" w-[30rem]"
                min={0}
                max={30}
                step={1}
                setRangeValue={setPreferAge}
                rangeValue={preferAge}
                category="age"
              />
            </Container.FlexCol>
          </Container.Grid>
          <Container.Grid className="items-start gap-4 sm:grid-cols-[12.8125rem_auto]">
            <Typography.SubTitle1 className="mt-3 text-brown">
              룸메이트 특징
            </Typography.SubTitle1>
            <Container.FlexCol className="gap-2.5">
              <input
                type="text"
                name="mateAppeals"
                value={mateAppeal}
                onChange={onChangeAppeal}
                onKeyDown={pressEnterCreateBadge}
                className="mb-[1rem] h-14 max-w-[30.4375rem] rounded-lg border-[1px] border-solid border-brown bg-transparent p-[1rem] placeholder:text-brown3 focus:outline-none focus:ring-1 focus:ring-brown2"
                placeholder="EX) 반려동물 NO, 늦게자요, 잠귀 어두운 분"
              />
              {form.watch('mate_appeal').length === 0 ? (
                <span className="h-[2.5rem]">&nbsp;</span>
              ) : (
                <BadgeButtons
                  contents={form.watch('mate_appeal')}
                  className=" gap-2"
                  badgeStyle="h-10 rounded-full px-5"
                  iconStyle="ml-2"
                  stroke="bg"
                  iconType="close"
                  typoStyle="text-bg"
                  onClick={onDeleteAppealBadge}
                />
              )}
            </Container.FlexCol>
          </Container.Grid>
          <Container.FlexCol>
            <Accordion
              title="내 프로필 수정"
              titleStyle="text-brown"
              guideline="작성하신 프로필과 달라진 점이 있다면 수정해주세요."
              guideStyle="text-brown1"
              openContainerStyle="bg-brown6 rounded-xl p-8"
            >
              <Container.FlexCol className="gap-11">
                <Container.FlexCol className="gap-6">
                  <Typography.SubTitle2 className="text-brown">
                    흡연여부
                  </Typography.SubTitle2>
                  <Container.FlexRow className="gap-2">
                    {smokeDisplayData.map(
                      ({ displayValue, stateValue, iconType }) => (
                        <BadgeButton.Outline
                          key={displayValue}
                          className="h-10 rounded-full px-4"
                          badgeActive={stateValue === form.watch('smoking')}
                          iconType={iconType}
                          iconClassName="h-[1.75rem] w-auto mr-1.5"
                          direction="left"
                          onClick={() => onClickSmokingType(stateValue)}
                        >
                          <Typography.P2>{displayValue}</Typography.P2>
                        </BadgeButton.Outline>
                      ),
                    )}
                  </Container.FlexRow>
                </Container.FlexCol>
                <Container.FlexCol className="gap-6">
                  <Typography.SubTitle2 className="text-brown">
                    반려동물
                  </Typography.SubTitle2>
                  <Container.FlexRow className="gap-2">
                    {registPetDisplayData.map(
                      ({ displayValue, stateValue, iconType }) => (
                        <BadgeButton.Outline
                          key={displayValue}
                          className="h-10 rounded-full px-3"
                          badgeActive={stateValue === form.watch('pet')}
                          iconType={iconType}
                          iconClassName="w-[1.125rem] h-auto mr-1.5"
                          direction="left"
                          onClick={() => onClickPetType(stateValue)}
                        >
                          <Typography.P2>{displayValue}</Typography.P2>
                        </BadgeButton.Outline>
                      ),
                    )}
                  </Container.FlexRow>
                </Container.FlexCol>
                <Container.FlexCol className="mt-3 gap-6">
                  <Typography.SubTitle2 className="text-brown">
                    나의 라이프 스타일
                  </Typography.SubTitle2>
                  <Container.FlexCol className="gap-2.5">
                    <input
                      type="text"
                      name="myAppeals"
                      value={myAppeal}
                      onChange={onChangeAppeal}
                      onKeyDown={pressEnterCreateBadge}
                      className="mb-[1rem] h-14 max-w-[30.4375rem] rounded-lg border-[1px] border-solid border-brown bg-transparent p-[1rem] placeholder:text-brown3 focus:outline-none focus:ring-1 focus:ring-brown2"
                      placeholder="EX) 반려동물 NO, 늦게자요, 잠귀 어두운 분"
                    />
                    {form.getValues('appeals').length === 0 ? (
                      <span className="h-[2.5rem]">&nbsp;</span>
                    ) : (
                      <BadgeButtons
                        contents={form.watch('appeals')}
                        className="gap-2"
                        badgeStyle="h-10 rounded-full px-5"
                        iconStyle="ml-2"
                        stroke="bg"
                        iconType="close"
                        typoStyle="text-bg"
                        onClick={onDeleteAppealBadge}
                      />
                    )}
                  </Container.FlexCol>
                </Container.FlexCol>
              </Container.FlexCol>
            </Accordion>
          </Container.FlexCol>
        </Container.FlexCol>
      </Container.FlexCol>
    </Container.FlexCol>
  );
}
