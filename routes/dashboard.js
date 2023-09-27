const express = require("express");
const dashboardRouter = express.Router();
const { API } = require("../util/constant");
const authMiddleware = require("../middlewares/auth_middleware");
const {GetMyLeaveStatusController}=require('../controllers/UserDashboard/getMyLeaveStatus')
const GetTotalProduction=require('../controllers/Dashboard/getTotalProduction');
const GetTotalTarget=require('../controllers/Dashboard/getTotalTarget');
const GetAvgDhuController=require('../controllers/Dashboard/getAvgDhu');
const GetTotalEfficiency=require('../controllers/Dashboard/getTotalEfficiency');
const GetLineRankListsController=require('../controllers/Dashboard/getLineRankLists');
const GetTargetProductionController=require('../controllers/Dashboard/getTargetProduction');
const GetAllDefectsController=require('../controllers/Dashboard/getAllDefects');
const GetTopFiveDefectsController=require('../controllers/Dashboard/getTopFiveDefects');
const GetLineWiseDhuController=require('../controllers/Dashboard/getLineWiseDhu');
const GetLineWiseHourlyProductionController=require('../controllers/Dashboard/getLineWiseHourlyProduction');
const GetHourlyProductionController=require('../controllers/Dashboard/getHourlyProduction');
const GetRunningStyleDetailsController=require('../controllers/Dashboard/getRunningStyleDetails');

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


