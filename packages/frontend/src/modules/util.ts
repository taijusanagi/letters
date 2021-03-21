export const shortenAddress = (rawAddress: string): string => {
  const pre = rawAddress.substring(0, 4);
  const post = rawAddress.substring(39);
  return `${pre}...${post}`;
};
