const Joi = require('joi');
const { 
    MESSAGE,
    SOCKET 
} = require('../../../../util/constant');
const addUpdateCategoryServices = require('../../../../services/tender/category/create_update/create_update_category_services');

const schema = Joi.object({
    CategoryId:Joi.number().optional(),
    CategoryName: Joi.string().required(),
    CategoryDescription: Joi.string().optional(),
    CreatedBy:Joi.number().required()
});

const controller = async (req, res) => {
    try {
        const data = await addUpdateCategoryServices(req.body);
        if (data.message==="success") {
            return res.status(200).json({ message: "Successfully inserted", status_code: 201, data: data.data,IsEntry:true });
        }
        return res.status(200).json({ message: [],IsEntry:false});
    } catch (error) {
        console.log(error);
        return res.status(MESSAGE.SERVER_ERROR.STATUS_CODE).send(MESSAGE.SERVER_ERROR.CONTENT);
    }
}

module.exports = { controller, schema }