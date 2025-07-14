// 첫 글자를 대문자로 변환하는 함수
const capitalize = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default capitalize;
