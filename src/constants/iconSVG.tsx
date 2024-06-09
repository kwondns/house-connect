import { ReactNode } from 'react';

import Apartment from '@/assets/icons/apartment.svg?react';
import Close from '@/assets/icons/close.svg?react';
import DontMindPet from '@/assets/icons/dont-mind-pet.svg?react';
import DontMindSex from '@/assets/icons/dont-mind-sex.svg?react';
import ExpandArrow from '@/assets/icons/expand-arrow.svg?react';
import Female from '@/assets/icons/female.svg?react';
import GoogleLogo from '@/assets/icons/google-logo.svg?react';
import Invisible from '@/assets/icons/invisible.svg?react';
import KakaotalkLogo from '@/assets/icons/kakaotalk-logo.svg?react';
import LeftArrowLogo from '@/assets/icons/left-arrow.svg?react';
import Logo from '@/assets/icons/logo.svg?react';
import Male from '@/assets/icons/male.svg?react';
import NonePetLover from '@/assets/icons/none-pet-lover.svg?react';
import NoneSmoke from '@/assets/icons/none-smoke.svg?react';
import PetLover from '@/assets/icons/pet-lover.svg?react';
import RightArrow from '@/assets/icons/right-arrow.svg?react';
import SingleFamilyHouse from '@/assets/icons/single-family-house.svg?react';
import Smoke from '@/assets/icons/smoke.svg?react';
import StudioOfficetel from '@/assets/icons/studio-officetel.svg?react';
import VillaTownhouse from '@/assets/icons/villa-townhouse.svg?react';
import HouseCharacter from '@/assets/images/house-character.svg?react';
import ImgWelcome from '@/assets/images/img-welcome.svg?react';
import SeekingHouse from '@/assets/images/seeking-house.svg?react';
import Visible from '@/assets/icons/visible.svg?react';
import AlarmExist from '@/assets/icons/alarm-exist.svg?react';
import AlarmNone from '@/assets/icons/alarm-none.svg?react';
import Avatar from '@/assets/icons/avatar.svg?react';
import Heart from '@/assets/icons/heart.svg?react';
import Share from '@/assets/icons/share.svg?react';
import MiniSmoke from '@/assets/icons/mini-smoke.svg?react';
import MiniNoneSmoke from '@/assets/icons/mini-none-smoke.svg?react';
import MiniMale from '@/assets/icons/mini-male-icon.svg?react';
import MiniFemale from '@/assets/icons/mini-female-icon.svg?react';
import GenderIntersex from '@/assets/icons/ph_gender-intersex.svg?react';
import MiniPetLover from '@/assets/icons/mini-pet-lover.svg?react';
import MiniNonePetLover from '@/assets/icons/mini-none-pet-lover.svg?react';
import MiniDontMindPet from '@/assets/icons/mini-dont-mind-pet.svg?react';
import { IconType } from '@/types/icon.type';

const IconSVG: { [key in IconType]: ReactNode } = {
  character: <HouseCharacter />,
  logo: <Logo />,
  welcome: <ImgWelcome />,
  'seeking-house': <SeekingHouse />,
  male: <Male />,
  female: <Female />,
  'dont-mind-sex': <DontMindSex />,
  'dont-mind-pet': <DontMindPet />,
  'pet-lover': <PetLover />,
  'none-pet-lover': <NonePetLover />,
  'studio-officetel': <StudioOfficetel />,
  'villa-townhouse': <VillaTownhouse />,
  apartment: <Apartment />,
  'single-family-house': <SingleFamilyHouse />,
  smoke: <Smoke />,
  'none-smoke': <NoneSmoke />,
  'left-arrow': <LeftArrowLogo />,
  'right-arrow': <RightArrow />,
  close: <Close />,
  'expand-arrow': <ExpandArrow />,
  'google-logo': <GoogleLogo />,
  'kakaotalk-logo': <KakaotalkLogo />,
  invisible: <Invisible />,
  visible: <Visible />,
  'alarm-exist': <AlarmExist />,
  'alarm-none': <AlarmNone />,
  avatar: <Avatar />,
  heart: <Heart />,
  share: <Share />,
  'mini-smoke': <MiniSmoke />,
  'mini-none-smoke': <MiniNoneSmoke />,
  'mini-male': <MiniMale />,
  'mini-female': <MiniFemale />,
  'mini-gender-intersex': <GenderIntersex />,
  'mini-pet-lover': <MiniPetLover />,
  'mini-none-pet-lover': <MiniNonePetLover />,
  'mini-dont-mind-pet': <MiniDontMindPet />,
};

export default IconSVG;
