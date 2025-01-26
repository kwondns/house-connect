import { RegisterOptions } from 'react-hook-form';

export type FormValidationType<T> = { [key in keyof T]: RegisterOptions };
