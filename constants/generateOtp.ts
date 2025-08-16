const generateOtp = () => {
  return Math.random().toString().slice(2, 8);
};

export default generateOtp;
