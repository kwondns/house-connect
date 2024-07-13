import ColorType from '@/types/color.type';

export type IconType =
  | 'character'
  | 'logo'
  | 'welcome'
  | 'seeking-house'
  | 'male'
  | 'female'
  | 'dont-mind-sex'
  | 'dont-mind-pet'
  | 'pet-lover'
  | 'none-pet-lover'
  | 'studio-officetel'
  | 'villa-townhouse'
  | 'apartment'
  | 'single-family-house'
  | 'smoke'
  | 'none-smoke'
  | 'right-arrow'
  | 'left-arrow'
  | 'expand-arrow'
  | 'close'
  | 'google-logo'
  | 'invisible'
  | 'kakaotalk-logo'
  | 'visible'
  | 'alarm-exist'
  | 'alarm-none'
  | 'avatar'
  | 'front'
  | 'paper-clip'
  | 'send'
  | 'camera'
  | 'prev'
  | 'next'
  | 'back'
  | 'icon-male'
  | 'icon-female'
  | 'icon-gender-free';

export type CustomIconType = {
  fill?: ColorType;
  stroke?: ColorType;
};

export type IconDirectionType = 'left' | 'right' | 'top' | 'bottom';
