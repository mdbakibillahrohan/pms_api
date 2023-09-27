/*
* Author: Asib Al Hasan
* Title: Get User Unit With ID
* Description: Jodi user er Admin dashboard permission thke taile tar initiale vabe dashboard er kichu data load korano lagbe . Er jnno tar unit details lagbe . 
* Date: 30 July 2023
*/

const Joi = require("joi");
const {executeSqlB}=require('../../util/db')


const schema = Joi.object().keys({
  UnitId: Joi.number().max(10).required(),
  filterDate:Joi.string().trim().required()
});

const GetLineWiseDhuController = async (req, res) => {
  const isValidate = schema.validate(req.query);

  if (isValidate.error) {
    return res.status(400).json({ error: isValidate.error });
  }
  let data = [];
  try {
    const {
      UnitId,
      filterDate
    } = req.query;


    const sql=`Select top(10) p.LineId LineId,l.LineName name, CONVERT(decimal(10,1), CAST((ISNULL(SUM(p.CountValue),0))*100 as decimal(10,2))/CAST((ISNULL(TotalOk,0)) as decimal(10,2))) DHU
    from HourlySewingProductionCount p
        left join (select LineId,ISNULL(SUM(CountValue),0) TotalOk from HourlySewingProductionCount
        where UnitId=${UnitId}
        and cast(CreateAt as date) = cast('${filterDate}' as date) and InputTypeId=1
        group by LineId) o on o.LineId=p.LineId
        left join LineNew l on l.LineId = p.LineId
    where UnitId=${UnitId}
    and cast(CreateAt as date) = cast('${filterDate}' as date) and InputTypeId in (2,3) 
    group by p.LineId, o.TotalOk, l.LineName
    order by p.LineId`;

    // const sql=`Select top(10) p.LineId LineId,l.LineName name, CONVERT(decimal(10,1), CAST((ISNULL(SUM(p.CountValue),0))*100 as decimal(10,2))/CAST((ISNULL(TotalOk,0)) as decimal(10,2))) DHU
    // from HourlySewingProductionCount p
    //     left join (select LineId,ISNULL(SUM(CountValue),0) TotalOk from HourlySewingProductionCount
    //     where UnitId=${UnitId}
    //     and cast(CreateAt as date) = cast('2023-9-7' as date) and InputTypeId=1
    //     group by LineId) o on o.LineId=p.LineId
    //     left join LineNew l on l.LineId = p.LineId
    // where UnitId=${UnitId}
    // and cast(CreateAt as date) = cast('2023-9-7' as date) and InputTypeId in (2,3) 
    // group by p.LineId, o.TotalOk, l.LineName
    // order by p.LineId`;
    
    data = await executeSqlB(sql);

    //console.log(data.recordsets[0])

    if (data.recordset.length > 0) {
        let info=data.recordsets[0];

        return res.status(200).json({IsSuccess:true,data:info});
    }
    return res.status(500).json({
        IsSuccess:false,
        message: "Internal Server Error",
    });
  } catch (error) {
    return res.status(500).send("Internall server error");
  }
};


module.exports = GetLineWiseDhuController;
