export interface InternationalIndicatorItemApi {
  avgPrice: number;
  indicatorName: string;
  mainIndicatorId: number;
  photo: string;
  insertionDate: string;
  currency: string;
  unit: string;
}

export interface InternationalGroupApi {
  generalIndicatorId: number;
  generalIndicator: string;
  internationalIndicatorsData: InternationalIndicatorItemApi[];
}

export interface GeneralIndicatorItemApi {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  changeRateDaialy: number;
  changeRatePercentDaialy: number;
  minPriceWithinYear: number;
  minWithinYearDate: string;
  maxPriceWithinYear: number;
  maxWithinYearDate: string;
  indicatorId: number;
  indictorName: string;
  currency: string;
  unit: string;
  insertionDate: string;
  govMin: number | null;
  govMax: number | null;
  minSubIndicatorName: string;
  minSubIndicatorPrice: number;
  maxSubIndicatorPrice: number;
  maxSubIndicatorName: string;
}

export interface GeneralIndicatorResponseApi {
  retail: GeneralIndicatorItemApi[];
  wholesale: GeneralIndicatorItemApi[];
  port: GeneralIndicatorItemApi[];
  field: GeneralIndicatorItemApi[];
  international: GeneralIndicatorItemApi[];
  [key: string]: GeneralIndicatorItemApi[];
}
