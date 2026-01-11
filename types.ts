
export interface FacialAnalysis {
  overallScore: number;
  proportions: {
    threeParts: {
      upper: number; // Percentage
      middle: number;
      lower: number;
      description: string;
    };
    fiveEyes: {
      leftSide: number;
      leftEye: number;
      middle: number;
      rightEye: number;
      rightSide: number;
      description: string;
    };
  };
  features: {
    eyes: string;
    nose: string;
    lips: string;
    jawline: string;
  };
  suggestions: {
    makeup: string[];
    medicalBeauty?: string[];
    lifestyle: string[];
  };
  summary: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
