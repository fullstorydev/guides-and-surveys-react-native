import { SURVEY_STATE } from '../constants';

export type UsetifulResponse = {
  tours?: Tour[];
  surveys?: Survey[];
};

export type Tour = {
  id: string;
  name: string;
  steps: TourStep[];
  targetOperator: number;
  targets: Target[];
  themeObject: Theme;
  progress: boolean;
  progressType: number;
  rememberLastStep: boolean;
  objectPriority: number;
  trigger: TourTrigger;
};
export type ActionType = {
  id: string;
  styleType: 'Primary' | 'Secondary' | string;
  type: 'next' | 'close' | 'previous' | 'gototour' | 'goto' | 'jump';
  value: string;
  tourId: string;
  url?: string;
  to: string;
};
export type TourStep = {
  actions: ActionType[];
  content: string;
  id: string;
  title: string;
  type: 'modal' | 'pointer' | 'slideout';
  element: string;
  alignment: 'left' | 'right' | 'center';
};
export type TourTrigger = {
  type: string;
};
export type Target = {
  type: 'address-simple' | 'user-segment' | string;
  url?: string;
  formattedName?: string;
  name?: string;
};

export type Measure = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

export type Theme = {
  primaryColor: string;
  progressBarColor: string;
  buttonPositionBottom: number;
  buttonPositionRight: number;
  fontFamily: string;
  customFontFamily: string;
  fontTitleFamily: string;
  customFontTitleFamily: string;
  fontButtonFamily: string;
  customFontButtonFamily: string;
  fontColor: string;
  bgColor: string;
  secondaryButtonColor: string;
  fontSize: number;
  fontTitleSize: number;
  fontButtonSize: number;
};

export type UsetifulTag = {
  [key: string]: string;
};

export type ProgressorTour = {
  id: string;
  state: string;
  name: string;
  currentStep: number;
  updatedAt: string;
};

export type UFCompleted = {
  type: string;
  id: string;
  updatedAt: string;
};

export type ProgressorData = {
  uf_completed: UFCompleted[];
  tours: ProgressorTour[];
  uf_surveys: SurveyProgress[];
  autoSegment: string;
  customSegments: string[];
  storedAt: string;
};

type SurveyState = (typeof SURVEY_STATE)[keyof typeof SURVEY_STATE];

export type SurveyProgress = {
  id: string;
  name: string;
  currentPageId: string;
  updatedAt: string;
  state: SurveyState;
};

export type ActiveExperience =
  | { type: 'tour'; experience: Tour; currentPageIndex: number }
  | { type: 'survey'; experience: Survey; currentPageIndex: number }
  | null;

/*
  Survey types
  */
export type SurveyPage = {
  id: string;
  name: string;
  type: 'modal' | 'slideout';
  content: any;
  customStyle: any;
  actions: SurveyAction;
  questions: SurveyQuestion[];
};

export type SurveyAction = {
  action: string;
  close: boolean;
  confirm: boolean;
  label: string;
};

export type SurveyQuestion = {
  alignment: 'left' | 'right' | 'center';
  id: string;
  type: 'nps' | 'open';
  maximalValueLabel: string;
  minimalValueLabel: string;
  options: any[] | null;
  required: boolean;
  question: string;
};

export type Survey = {
  active: boolean;
  id: string;
  name: string;
  objectPriority: number;
  pages: SurveyPage[];
  targets: Target[];
  trigger: SurveyTrigger;
};

export type SurveyTrigger = AutomaticSurveyTrigger | ManualSurveyTrigger;

type AutomaticSurveyTrigger = {
  autoplay: true;
  showEveryTime: true;
  type: typeof TRIGGER_TYPE_EVERYTIME_TILL_COMPLETE;
};

type ManualSurveyTrigger = {
  autoplay: false;
  showEveryTime: true;
  type: typeof TRIGGER_TYPE_EVERYTIME;
  pageEvent?: PageEvent;
};
export const TRIGGER_TYPE_EVERYTIME_TILL_COMPLETE = 'everytime_till_complete';
export const TRIGGER_TYPE_EVERYTIME = 'everytime';
// TODO we do not support manual triggers
type PageEvent = {
  url: string;
  type: string;
  name: string;
  element: string;
  eventName: string;
  loop?: string;
  tag?: string;
  operator?: string;
  value?: string;
};
