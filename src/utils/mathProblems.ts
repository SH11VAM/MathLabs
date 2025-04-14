// Math problem generation functions

// Addition problems
export const generateAdditionProblem = (classLevel: number) => {
  let num1 = 0;
  let num2 = 0;
  
  switch (classLevel) {
    case 1:
      // Single-digit addition (no carrying)
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * (9 - num1)) + 1; // Ensure sum is less than 10
      break;
    case 2:
      // Two-digit addition with carrying
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 90) + 10;
      
      // Ensure at least one place needs carrying
      if ((num1 % 10 + num2 % 10) < 10 && (Math.floor(num1 / 10) % 10 + Math.floor(num2 / 10) % 10) < 10) {
        num1 = num1 - (num1 % 10) + (10 - num2 % 10 + 1); // Force carrying in ones place
      }
      break;
    case 3:
    case 4:
      // Three-digit addition with multiple carrying
      // First, generate a random sum between 100 and 1999
      const targetSum = Math.floor(Math.random() * 1900) + 100;
      
      // Generate first number between 100 and targetSum-100
      num1 = Math.floor(Math.random() * (targetSum - 100)) + 100;
      
      // Calculate second number to get the target sum
      num2 = targetSum - num1;
      
      // Ensure both numbers are three digits
      if (num2 < 100) {
        num2 = 100;
        num1 = targetSum - num2;
      }
      
      // Ensure multiple places need carrying
      if ((num1 % 10 + num2 % 10) < 10) {
        // Adjust to force carrying in ones place
        const onesCarry = 10 - (num1 % 10 + num2 % 10) + 1;
        num1 = num1 - (num1 % 10) + onesCarry;
        num2 = targetSum - num1;
      }
      
      if ((Math.floor(num1 / 10) % 10 + Math.floor(num2 / 10) % 10) < 10) {
        // Adjust to force carrying in tens place
        const tensCarry = 10 - (Math.floor(num1 / 10) % 10 + Math.floor(num2 / 10) % 10) + 1;
        num1 = num1 - (Math.floor(num1 / 10) % 10 * 10) + (tensCarry * 10);
        num2 = targetSum - num1;
      }
      break;
    default:
      // Default to three-digit addition with possible four-digit sum
      num1 = Math.floor(Math.random() * 900) + 100;
      num2 = Math.floor(Math.random() * 900) + 100;
  }
  
  const sum = num1 + num2;
  
  return { num1, num2, sum };
};

// Subtraction problems
export const generateSubtractionProblem = (classLevel: number) => {
  let num1 = 0;
  let num2 = 0;
  
  switch (classLevel) {
    case 1:
      // Simple single-digit subtraction without borrowing
      num2 = Math.floor(Math.random() * 9) + 1;
      num1 = num2 + Math.floor(Math.random() * (9 - num2)) + 1; // Ensure num1 > num2 and result is single digit
      break;
    case 2:
      // Two-digit subtraction with borrowing
      num2 = Math.floor(Math.random() * num1) + 10;
      num1 = Math.floor(Math.random() * 90) + 10;
      
      // Ensure num1 > num2
      if (num1 <= num2) {
        num1 = num2 + Math.floor(Math.random() * 10) + 1;
      }
      
      // Force borrowing in ones place
      if ((num1 % 10) >= (num2 % 10)) {
        // Swap the ones digits
        const onesDigit1 = num1 % 10;
        const onesDigit2 = num2 % 10;
        num1 = Math.floor(num1 / 10) * 10 + onesDigit2;
        num2 = Math.floor(num2 / 10) * 10 + onesDigit1;
      }
      break;
    case 3:
    case 4:
      // Three-digit subtraction with multiple borrowing
      num1 = Math.floor(Math.random() * 400) + 100;
      num2 =Math.floor(Math.random() * num1) + 1;
      
      // Ensure num1 > num2
      if (num1 <= num2) {
        num1 = num2 + Math.floor(Math.random() * 100) + 1;
      }
      
      // Force borrowing in ones place
      if ((num1 % 10) >= (num2 % 10)) {
        num1 = num1 - (num1 % 10) + ((num2 % 10) - 1); // Make ones digit of num1 less than ones digit of num2
      }
      
      // Force borrowing in tens place
      if ((Math.floor(num1 / 10) % 10) >= (Math.floor(num2 / 10) % 10)) {
        num1 = num1 - (Math.floor(num1 / 10) % 10 * 10) + ((Math.floor(num2 / 10) % 10 - 1) * 10);
      }
      break;
    default:
      // Default to three-digit subtraction
      num1 = Math.floor(Math.random() * 400) + 100;
      num2 =Math.floor(Math.random() * num1) + 1;
      
      if (num1 <= num2) {
        num1 = num2 + Math.floor(Math.random() * 100) + 1;
      }
  }
  
  const difference = num1 - num2;
  
  return { num1, num2, difference };
};

// Multiplication problems
export const generateMultiplicationProblem = (difficulty: string) => {
  let num1 = 0;
  let num2 = 0;
  
  switch (difficulty) {
    case 'easy':
      // Simple multiplication (1-10)
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      break;
    case 'medium':
      // Two-digit by one-digit multiplication
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 9) + 1;
      break;
    case 'hard':
      // Two-digit by two-digit multiplication
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 90) + 10;
      break;
  }
  
  const product = num1 * num2;
  
  return { num1, num2, product };
};

// Division problems
export const generateDivisionProblem = (difficulty: string) => {
  let dividend = 0;
  let divisor = 0;
  let quotient = 0;
  let remainder = 0;
  
  switch (difficulty) {
    case 'easy':
      // Simple division with no remainder or small remainder
      divisor = Math.floor(Math.random() * 9) + 2; // Divisor between 2-10
      quotient = Math.floor(Math.random() * 9) + 1; // Quotient between 1-10
      remainder = Math.floor(Math.random() * divisor); // Remainder less than divisor
      dividend = divisor * quotient + remainder;
      break;
    case 'medium':
      // Two-digit by one-digit division with possible remainder
      divisor = Math.floor(Math.random() * 9) + 2; // Divisor between 2-10
      quotient = Math.floor(Math.random() * 9) + 10; // Quotient between 10-19
      remainder = Math.floor(Math.random() * divisor); // Remainder less than divisor
      dividend = divisor * quotient + remainder;
      break;
    case 'hard':
      // Three-digit by one-digit or two-digit division with remainder
      divisor = Math.floor(Math.random() * 9) + 6; // Divisor between 6-15
      quotient = Math.floor(Math.random() * 10) + 20; // Quotient between 20-30
      remainder = Math.floor(Math.random() * divisor); // Remainder less than divisor
      dividend = divisor * quotient + remainder;
      break;
  }
  
  return { dividend, divisor, quotient, remainder };
};
