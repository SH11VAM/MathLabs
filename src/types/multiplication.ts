export interface CalculationStep {
    type: 'multiply' | 'carry' | 'partialProduct' | 'finalSum';
    description: string;
    highlightPositions?: {
      multiplicand?: number[];
      multiplier?: number[];
      product?: number[];
      carry?: number[];
    };
    carryValues?: { [key: number]: number };
    partialProducts?: number[][];
    currentPartialProductIndex?: number;
    currentColumnIndex?: number;
    finalProduct?: number[];
    addedValues: number[];
    
  }
  
  export interface MultiplicationState {
    multiplicand: number;
    multiplier: number;
    steps: CalculationStep[];
    currentStep: number;
    isComplete: boolean;
  }
  