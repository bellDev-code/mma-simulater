type WeightClassName = 'fly' | 'bantam' | 'light' | 'welter' | 'middle' | 'heavy';

export type Weight = {
  name: WeightClassName;
  limit: WeightLimit;
};

export type WeightLimit = {
  weightLimit: number;
  difference?: number;
};
