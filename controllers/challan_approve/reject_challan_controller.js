const Joi = require("joi");
const { MESSAGE } = require("../../util/constant");
const rejectChallanServices = require("../../services/challan_approval_services/reject_challan_services");

const schema = Joi.object({
  challan_id: Joi.number().required(),
  challan_type: Joi.string().valid("sewing", "wash").required(),
  approver_stack: Joi.string().valid("ApprovedBy", "RDC").required(),
  remarks: Joi.string().min(1).max(2000).required(),
});

const controller = async (req, res) => {
  try {
    req.body.userInfo = req.userInfo;
    const data = await rejectChallanServices(req.body);
    if (data.message==="Success") {
      return res
        .status(MESSAGE.SUCCESS_GET.STATUS_CODE)
        .json({ message: "Successfully reject challan" });
    }
    return res
      .status(MESSAGE.BAD_REQUEST.STATUS_CODE)
      .json({
        message: data.message,
        status_code: MESSAGE.BAD_REQUEST.STATUS_CODE,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(MESSAGE.SERVER_ERROR.STATUS_CODE)
      .send(MESSAGE.SERVER_ERROR.CONTENT);
  }
};

module.exports = { controller, schema };
