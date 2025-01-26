import Ajv, { Schema } from "ajv"; // JSON schema validator

const ajv = new Ajv();
export const ValidateRequest = <T>(
  requestBody: unknown, 
  schema: Schema
) => {
  console.log('utils/validator.ts validatedData requestBody', requestBody)
  console.log('utils/validator.ts validatedData schema', schema)
  // Compile incoming schema based on type, then generate 1 function where you can validate that particular req.body.
  const validatedData = ajv.compile<T>(schema);
  console.log('utils/validator.ts ----------> validatedData ', validatedData)
  if (validatedData(requestBody)) {
    return false;
  }
  const errors = validatedData.errors?.map(
    (err) => err.message
  );
  return errors && errors[0];
};
