/**
 *
 * This middleware validate the payload
 * Two parameter receives Schema and validation stack
 * stack means which types of payload is this body or query
 * @param Schema
 * @param stack
 * @returns
 */
const JoiValidator = (Schema, Stack = "body") => {
  return (req, res, next) => {
    if (Schema.validate(req[Stack])) {
      const validatePayload = Schema.validate(req[Stack]);
      if (validatePayload.error) {
        return res.status(422).send({
          message: validatePayload.error.message,
        });
      }
    }
    next();
  };
};
module.exports = JoiValidator;
