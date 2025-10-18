import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../schemas/en15804.schema.json" assert { type: "json" };

const ajv = new Ajv({ allErrors: true });
addFormats(ajv as any);
const validate = ajv.compile(schema);

export function validateSchema(payload: unknown) {
  const ok = validate(payload);
  return { valid: !!ok, errors: validate.errors ?? [] };
}
