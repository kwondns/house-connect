import { useRecoilState } from 'recoil';

import Container from '@/components/atoms/Container';
import SignUpProfileStepTitleTemplate from '@/components/templates/SignUpProfileStepTitle.template';
import Typography from '@/components/atoms/Typography';
import BadgeButton from '@/components/molecules/BadgeButton';
import Selector from '@/components/molecules/Selector';
import { district, region } from '@/constants/regions';
import {
  SignUpProfileRegionsAtom,
  SignUpProfileTermAtom,
} from '@/stores/sign.store';
import LabelDualInputRange from '@/components/organisms/LabelDualInputRange';
import DistrictSelector from '@/components/organisms/districtSelector/DistrictSelector';

export default function SignUpProfile1_2Template() {
  const [regions, setRegions] = useRecoilState(SignUpProfileRegionsAtom);
  const [term, setTerm] = useRecoilState(SignUpProfileTermAtom);

  // ! TODO Selector 연결 후 제거
  const regi = ['경기 고양시', '서울 강남구'];
  return (
    <Container.FlexCol className="min-w-full px-2">
      <Container.FlexCol>
        <SignUpProfileStepTitleTemplate step="1-2" title="내가 찾는 집은..." />
        <Typography.SubTitle1 className="text-brown">위치</Typography.SubTitle1>
        <Container.FlexCol className="mb-[4.25rem] gap-y-9">
          <Container.FlexRow className="mt-11 gap-x-6">
            {regi?.map(location => (
              <BadgeButton.Fill
                key={location}
                className="gap-x-5 rounded-[30px] p-4"
                iconType="close"
                stroke="bg"
              >
                <Typography.P1>{location}</Typography.P1>
              </BadgeButton.Fill>
            ))}
          </Container.FlexRow>
          {/* TODO Selector 변경 */}
          <DistrictSelector />

          {/* <Container.FlexRow>
            <Selector label="지역" contents={region} />
            <Selector label="시, 구" contents={district['경기']} />
          </Container.FlexRow> */}
        </Container.FlexCol>
        <Container.FlexCol>
          <Typography.SubTitle1 className="mb-11 text-brown">
            기간
          </Typography.SubTitle1>
          <LabelDualInputRange
            className="w-[480px]"
            min={0}
            max={24}
            step={1}
            setRangeValue={setTerm}
            rangeValue={term}
            category="term"
          />
        </Container.FlexCol>
      </Container.FlexCol>
    </Container.FlexCol>
  );
}
