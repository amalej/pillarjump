export function generateId() {
  const baseLength = 16;
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < baseLength) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  const date = new Date();
  const timestamp = date.getTime();
  result += timestamp.toString(16);
  return result;
}
