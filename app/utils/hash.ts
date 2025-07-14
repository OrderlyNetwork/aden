/**
 * 비밀번호 해싱 유틸리티
 * 클라이언트에서 비밀번호를 SHA-256으로 해싱
 */

/**
 * SHA-256 해싱 함수
 * @param password - 평문 비밀번호
 * @returns Promise<string> - 해싱된 비밀번호 (hex 형태)
 */
export const hashPassword = async (password: string): Promise<string> => {
  // TextEncoder를 사용하여 문자열을 바이트 배열로 변환
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Web Crypto API를 사용하여 SHA-256 해싱
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // ArrayBuffer를 hex 문자열로 변환
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

/**
 * 비밀번호 강도 검증
 * @param password - 평문 비밀번호
 * @returns boolean - 비밀번호가 안전한지 여부
 */
export const isPasswordStrong = (password: string): boolean => {
  // 최소 8자, 대문자, 소문자, 숫자, 특수문자 포함
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * 비밀번호 강도 점수 계산
 * @param password - 평문 비밀번호
 * @returns number - 0-4 점수 (4가 가장 강함)
 */
export const getPasswordStrength = (password: string): number => {
  let score = 0;
  
  // 길이 체크
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // 문자 종류 체크
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  
  return Math.min(score, 4);
};