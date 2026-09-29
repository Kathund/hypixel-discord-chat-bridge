import zod from "zod";
import { Config } from "../../src/types/config.ts";
import { saveFile } from "../utils.ts";

await saveFile("docs/config.schema.json", JSON.stringify(zod.toJSONSchema(Config)));
