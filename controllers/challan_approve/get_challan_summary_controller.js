const Joi = require("joi");
const { MESSAGE } = require("../../util/constant");
const getChallanSummaryServices = require("../../services/challan_approval_services/get_challan_summary_services");

const schema = Joi.object({
  challan_id: Joi.number().required(),
  challan_type: Joi.string().valid("sewing", "wash").required(),
  approver_stack: Joi.string().valid("RDC", "ApprovedBy", "CheckedBy").required()
});

const controller = async (req, res) => {
  try {
    const data = await getChallanSummaryServices(req.body);
    if (data) {
      return res
        .status(MESSAGE.SUCCESS_GET.STATUS_CODE)
        .json({
          message: MESSAGE.SUCCESS_GET.CONTENT,
          status_code: MESSAGE.SUCCESS_GET.STATUS_CODE,
          data,
        });
    }
    return res
      .status(MESSAGE.SERVER_ERROR.STATUS_CODE)
      .json({ message: MESSAGE.SERVER_ERROR.CONTENT });
  } catch (error) {
    console.log(error);
    return res
      .status(MESSAGE.SERVER_ERROR.STATUS_CODE)
      .send(MESSAGE.SERVER_ERROR.CONTENT);
  }
};

module.exports = { controller, schema };
