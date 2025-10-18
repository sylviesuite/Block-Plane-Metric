import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../schemas/en15804.schema.json" assert { type: "json" };

const ajv = addFormats(new Ajv({ allErrors: true, strict: true }));
const validate = ajv.compile(schema);

export function validateSchema(payload: unknown) {
  const ok = validate(payload);
  return { valid: !!ok, errors: validate.errors ?? [] };
}
