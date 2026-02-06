import { parse, simplify } from "prismarine-nbt";
import { promisify } from "node:util";

const parseNbt = promisify(parse);

/**
 * Decodes a buffer containing NBT data
 * @param {Buffer} buffer
 * @returns {Promise<Object>}
 */
export async function decodeData(buffer) {
  const parsedNbt = await parseNbt(buffer);
  return simplify(parsedNbt);
}

/**
 * Decodes an array buffer containing NBT data
 * @param {string} arraybuf
 * @returns {Promise<Array>}
 */
export async function decodeArrayBuffer(arraybuf) {
  const buf = Buffer.from(arraybuf);

  let data = await parseNbt(buf);
  data = simplify(data);

  const items = data.i;
  return items;
}
