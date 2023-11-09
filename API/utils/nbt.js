import { parse, simplify } from "prismarine-nbt";
import { promisify } from "util";

const parseNbt = promisify(parse);

export const decodeData = async (buffer) => {
  const parsedNbt = await parseNbt(buffer);
  return simplify(parsedNbt);
};

export const decodeArrayBuffer = async (arraybuf) => {
  const buf = Buffer.from(arraybuf);

  let data = await parseNbt(buf);
  data = simplify(data);

  const items = data.i;
  return items;
};
