import api from '~/utils/api';

// Level thresholds based on BUGS holdings as provided in the requirements
const LEVEL_THRESHOLDS = [
  { level: 1, threshold: 0 },
  { level: 2, threshold: 1000 },
  { level: 3, threshold: 1500 },
  { level: 4, threshold: 2000 },
  { level: 5, threshold: 2500 },
  { level: 6, threshold: 3000 },
  { level: 7, threshold: 3500 },
  { level: 8, threshold: 4000 },
  { level: 9, threshold: 4500 },
  { level: 10, threshold: 5000 },
  { level: 11, threshold: 5500 },
  { level: 12, threshold: 6000 },
  { level: 13, threshold: 6500 },
  { level: 14, threshold: 7000 },
  { level: 15, threshold: 7500 },
  { level: 16, threshold: 8000 },
  { level: 17, threshold: 8500 },
  { level: 18, threshold: 9000 },
  { level: 19, threshold: 9500 },
  { level: 20, threshold: 10000 },
  { level: 21, threshold: 12500 },
  { level: 22, threshold: 15000 },
  { level: 23, threshold: 17500 },
  { level: 24, threshold: 20000 },
  { level: 25, threshold: 22500 },
  { level: 26, threshold: 25000 },
  { level: 27, threshold: 27500 },
  { level: 28, threshold: 30000 },
  { level: 29, threshold: 35000 },
  { level: 30, threshold: 40000 },
  { level: 31, threshold: 80000 },
  { level: 32, threshold: 130000 },
  { level: 33, threshold: 200000 },
  { level: 34, threshold: 280000 },
  { level: 35, threshold: 350000 },
  { level: 36, threshold: 400000 },
  { level: 37, threshold: 500000 },
  { level: 38, threshold: 600000 },
  { level: 39, threshold: 700000 },
  { level: 40, threshold: 800000 },
  { level: 41, threshold: 1200000 },
  { level: 42, threshold: 2000000 },
  { level: 43, threshold: 3000000 },
  { level: 44, threshold: 4000000 },
  { level: 45, threshold: 4500000 },
  { level: 46, threshold: 5000000 },
  { level: 47, threshold: 6500000 },
  { level: 48, threshold: 7500000 },
  { level: 49, threshold: 8800000 },
  { level: 50, threshold: 10000000 },
  { level: 51, threshold: 15000000 },
  { level: 52, threshold: 16000000 },
  { level: 53, threshold: 17000000 },
  { level: 54, threshold: 18000000 },
  { level: 55, threshold: 19000000 },
  { level: 56, threshold: 20000000 },
  { level: 57, threshold: 21500000 },
  { level: 58, threshold: 22500000 },
  { level: 59, threshold: 23500000 },
  { level: 60, threshold: 25000000 },
  { level: 61, threshold: 27000000 },
  { level: 62, threshold: 29000000 },
  { level: 63, threshold: 31000000 },
  { level: 64, threshold: 32500000 },
  { level: 65, threshold: 33000000 },
  { level: 66, threshold: 34000000 },
  { level: 67, threshold: 36000000 },
  { level: 68, threshold: 37500000 },
  { level: 69, threshold: 38500000 },
  { level: 70, threshold: 40000000 },
  { level: 71, threshold: 42000000 },
  { level: 72, threshold: 44000000 },
  { level: 73, threshold: 46000000 },
  { level: 74, threshold: 48000000 },
  { level: 75, threshold: 50000000 },
  { level: 76, threshold: 52000000 },
  { level: 77, threshold: 54000000 },
  { level: 78, threshold: 56000000 },
  { level: 79, threshold: 58000000 },
  { level: 80, threshold: 60000000 },
  { level: 81, threshold: 62000000 },
  { level: 82, threshold: 64000000 },
  { level: 83, threshold: 66000000 },
  { level: 84, threshold: 68000000 },
  { level: 85, threshold: 70000000 },
  { level: 86, threshold: 72000000 },
  { level: 87, threshold: 74000000 },
  { level: 88, threshold: 76000000 },
  { level: 89, threshold: 78000000 },
  { level: 90, threshold: 80000000 },
  { level: 91, threshold: 82000000 },
  { level: 92, threshold: 84000000 },
  { level: 93, threshold: 86000000 },
  { level: 94, threshold: 88000000 },
  { level: 95, threshold: 90000000 },
  { level: 96, threshold: 92000000 },
  { level: 97, threshold: 94000000 },
  { level: 98, threshold: 96000000 },
  { level: 99, threshold: 98000000 },
  { level: 100, threshold: 100000000 }
];

/**
 * Calculates the user level based on BUGS holdings
 * @param balance User's BUGS balance
 * @returns The calculated user level (1-100)
 */
export const calculateUserLevel = (balance: number): number => {
  // Find the highest level the user qualifies for
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (balance >= LEVEL_THRESHOLDS[i].threshold) {
      return LEVEL_THRESHOLDS[i].level;
    }
  }
  // Default to level 1
  return 1;
};

/**
 * Updates the user's level based on their BUGS balance by fetching user data
 * The backend will automatically calculate and update the level based on BUGS balance
 * @param userId The user ID
 * @returns Promise with the updated user data
 */
export const updateUserLevel = async (userId: number): Promise<any> => {
  try {
    // Simply fetch the user data - backend will handle level calculation
    const response = await api.get(`/api/users/${userId}`);
    console.log(`User level check completed for user ${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to update user level:', error);
    throw error;
  }
};