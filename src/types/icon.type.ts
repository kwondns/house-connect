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
  | 'back'
  | 'paper-clip'
  | 'send'
  | 'camera'
  | 'prev'
  | 'next'
  | 'back'
  | 'monthly-rental-price'
  | 'semi-monthly-rental-price'
  | 'year-rental-price'
  | 'dont-mind-rental-price'
  | 'one-person'
  | 'two-people'
  | 'three-people'
  | 'dont-mind-people' | 'done'

export type CustomIconType = {
  fill?: ColorType;
  stroke?: ColorType;
};

export type IconDirectionType = 'left' | 'right' | 'top' | 'bottom';
