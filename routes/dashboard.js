const express = require("express");
const dashboardRouter = express.Router();
const { API } = require("../util/constant");
const GetTotalProduction=require('../controllers/dashboard/getTotalProduction');
const GetTotalTarget=require('../controllers/dashboard/getTotalTarget');
const GetAvgDhuController=require('../controllers/dashboard/getAvgDhu');
const GetTotalEfficiency=require('../controllers/dashboard/getTotalEfficiency');
const GetLineRankListsController=require('../controllers/dashboard/getLineRankLists');
const GetTargetProductionController=require('../controllers/dashboard/getTargetProduction');
const GetAllDefectsController=require('../controllers/dashboard/getAllDefects');
const GetTopFiveDefectsController=require('../controllers/dashboard/getTopFiveDefects');
const GetLineWiseDhuController=require('../controllers/dashboard/getLineWiseDhu');
const GetLineWiseHourlyProductionController=require('../controllers/dashboard/getLineWiseHourlyProduction');
const GetHourlyProductionController=require('../controllers/dashboard/getHourlyProduction');
const GetRunningStyleDetailsController=require('../controllers/dashboard/getRunningStyleDetails');

dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_TOTAL_PRODUCTION,
    GetTotalProduction
);
dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_TOTAL_TARGET,
    GetTotalTarget
);
dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_AVG_DHU,
    GetAvgDhuController
);
dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_TOTAL_EFFICIENCY,
    GetTotalEfficiency
);
dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_LINE_RANK,
    GetLineRankListsController
);
dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_TARGET_PRODUCTION,
    GetTargetProductionController
);
dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_ALL_DEFECTS,
    GetAllDefectsController
);
dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_TOP_FIVE_DEFECTS,
    GetTopFiveDefectsController
);
dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_LINE_WISE_DHU,
    GetLineWiseDhuController
);
dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_LINE_WISE_HOURLY_PRODUCTION,
    GetLineWiseHourlyProductionController
);
dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_HOURLY_PRODUCTION,
    GetHourlyProductionController
);
dashboardRouter.get(
    API.API_CONTEXT + API.DASHBOARD_RUNNING_STYLE_DETAILS,
    GetRunningStyleDetailsController
);
// dashboardRouter.get(
//     API.API_CONTEXT + API.GET_LEAVE_INFO,
//     authMiddleware,
//     GetLeaveInfoController
// );
// dashboardRouter.get(
//     API.API_CONTEXT + API.GET_WEEK_OFF,
//     authMiddleware,
//     UserWeekOffController
// );
// dashboardRouter.get(
//     API.API_CONTEXT + API.GET_HOLIDAYS,
//     authMiddleware,
//     GetUserHolidaysController
// );

// dashboardRouter.get(
//     API.API_CONTEXT + API.GET_ATTENDENCE,
//     authMiddleware,
//     GetUserAttendenceController
// );

// dashboardRouter.get(
//     API.API_CONTEXT + API.GET_DAILY_MOVEMENT,
//     authMiddleware,
//     GetUserDailyMovementController
// );



module.exports=dashboardRouter


