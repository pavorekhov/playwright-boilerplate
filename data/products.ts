import type { ProductData } from '@models/index';

export const PRODUCTS: Record<string, ProductData> = {
  blueDuck: {
    name: 'Blue Duck',
    price: 20,
  },
  yellowDuck: {
    name: 'Yellow Duck',
    price: 18,
    size: 'Small',
  },
  greenDuck: {
    name: 'Green Duck',
    price: 20,
  },
  purpleDuck: {
    name: 'Purple Duck',
    price: 0,
  },
  redDuck: {
    name: 'Red Duck',
    price: 20,
  },
};

export const SIZES = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
} as const;

export const QUANTITIES = {
  one: 1,
  two: 2,
  three: 3,
} as const;
