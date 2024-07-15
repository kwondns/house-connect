import { useRecoilState } from 'recoil';

import Container from '@/components/atoms/Container';
import SignUpProfileStepTitleTemplate from '@/components/templates/SignUpProfileStepTitle.template';
import Typography from '@/components/atoms/Typography';
import Button from '@/components/atoms/Button';
import IconButton from '@/components/molecules/IconButton';
import { SignupProfileStateSelector } from '@/stores/sign.store';
import { SignUpProfileFormType } from '@/types/signUp.type';
import FormItem from '@/components/molecules/FormItem';
import {
  houseTypeDisplayData,
  rentalTypeDisplayData,
} from '@/constants/signUpProfileData';

export default function SignUpProfile1_1Template() {
  const [houseType, setHouseType] = useRecoilState(
    SignupProfileStateSelector('type'),
  );
  const [rentalType, setRentalType] = useRecoilState(
    SignupProfileStateSelector('rental_type'),
  );

  const onClickHouseType = (stateValue: SignUpProfileFormType['type']) =>
    setHouseType(stateValue);
  const onClickRentalType = (
    stateValue: SignUpProfileFormType['rental_type'],
  ) => setRentalType(stateValue);

  return (
    <Container.FlexCol className="min-w-full p-2">
      <Container.FlexCol>
        <SignUpProfileStepTitleTemplate step="1-1" title="내가 찾는 집은..." />
        <Typography.SubTitle1 className="text-brown">
          집 유형
        </Typography.SubTitle1>
        {/* TODO: 나중에 반응형 나오는 거 보고 flex-wrap을 지우고 grid로 할 지 생각해야 함. */}
        <Container.FlexRow className="mb-[4.25rem] mt-11 flex-wrap gap-6">
          {houseTypeDisplayData.map(
            ({ displayValue, stateValue, iconType }) => (
              <IconButton.Outline
                key={displayValue}
                className="basis-[11.25rem] gap-y-5 rounded-lg py-5"
                isActive={stateValue === houseType}
                iconType={iconType}
                direction="top"
                onClick={() => onClickHouseType(stateValue)}
              >
                <Typography.P2 className="text-brown">
                  {displayValue}
                </Typography.P2>
              </IconButton.Outline>
            ),
          )}
          <FormItem.Hidden<Pick<SignUpProfileFormType, 'type'>>
            name="type"
            valueProp={houseType}
          />
        </Container.FlexRow>
        <Typography.SubTitle1 className="text-brown">
          매물 종류
        </Typography.SubTitle1>
        <Container.FlexRow className="mt-11 flex-wrap gap-6">
          {rentalTypeDisplayData.map(({ displayValue, stateValue }) => (
            <Button.Outline
              key={displayValue}
              className="basis-[11.25rem] rounded-lg py-5"
              isActive={stateValue === rentalType}
              onClick={() => onClickRentalType(stateValue)}
            >
              <Typography.P2 className="w-full text-brown">
                {displayValue}
              </Typography.P2>
            </Button.Outline>
          ))}
          <FormItem.Hidden<Pick<SignUpProfileFormType, 'rental_type'>>
            name="rental_type"
            valueProp={rentalType}
          />
        </Container.FlexRow>
      </Container.FlexCol>
    </Container.FlexCol>
  );
}
