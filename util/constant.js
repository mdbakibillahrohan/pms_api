module.exports = {
  API: {
    API_CONTEXT: "/pms/api/v1/",
    LOGIN: "login",
    REGISTER: "register",
    USERINFO:'userinfo',
    DASHBOARD_TOTAL_PRODUCTION:'dashboard/totalProduction',
    DASHBOARD_TOTAL_TARGET:'dashboard/totalTarget',
    DASHBOARD_TOTAL_EFFICIENCY:'dashboard/totalEfficiency',
    DASHBOARD_AVG_DHU:'dashboard/avgDhu',
    DASHBOARD_LINE_RANK:'dashboard/lineRank',
    DASHBOARD_TARGET_PRODUCTION:'dashboard/targetProduction',
    DASHBOARD_ALL_DEFECTS:'dashboard/allDefects',
    DASHBOARD_TOP_FIVE_DEFECTS:'dashboard/topFiveDefects',
    DASHBOARD_LINE_WISE_DHU:'dashboard/lineWiseDhu',
    DASHBOARD_LINE_WISE_HOURLY_PRODUCTION:'dashboard/lineWiseHourlyProduction',
    DASHBOARD_HOURLY_PRODUCTION:'dashboard/hourlyProduction',
    DASHBOARD_RUNNING_STYLE_DETAILS:'dashboard/runningStyleDetails',

    APPROVAL_GET:'approval/get',
  },
  TABLE: {
    USERS: "users",
    STUDENT: "students",
    TEACHER: "teacher",
    COURSE: "course",
    NEWS:'news'
  },

  MESSAGE: {
    SERVER_ERROR: {
      CONTENT: "Internal server error",
      STATUS_CODE: 500
    },
    SUCCESS_GET: {
      CONTENT: "Successfully getting data from server",
      STATUS_CODE: 200,
    }
  }
};
