export const formatDate = (dateString) =>
  new Date(dateString)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");

const num =
  "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(
    " "
  );
const tens = "twenty thirty forty fifty sixty seventy eighty ninety".split(" ");

export const numberToWords = (n) => {
  if (n < 20) return num[n];
  const digit = n % 10;
  if (n < 100) return tens[~~(n / 10) - 2] + (digit ? "-" + num[digit] : "");
  if (n < 1000)
    return (
      num[~~(n / 100)] +
      " hundred" +
      (n % 100 == 0 ? "" : " " + numberToWords(n % 100))
    );
  return (
    numberToWords(~~(n / 1000)) +
    " thousand" +
    (n % 1000 != 0 ? " " + numberToWords(n % 1000) : "")
  );
};

export const toTitleCase = (str) =>
  str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );

export const roundOff = (value) => Math.round(value);
