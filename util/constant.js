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

    CREATE_CHALLAN: 'approval/create-challan',
    APPROVE_CHALLAN: 'approval/approve-challan',
    REJECT_CHALLAN: 'approval/reject-challan',
    GET_CHALLAN_LIST: 'approval/approve-challan-list',
    GET_CHALLAN_SUMMARY: 'approval/challan-summary',

    CHALLAN_CHECKING: 'check/checking',
    CHALLAN_CHEKING_LIST: 'check/checking-list',
    CHALLAN_CHEKING_SUMMARY: 'check/summary',

    CHALLAN_USER_PERMISSION_LIST: 'permission/get-permission-list',
    CHALLAN_USER_PERMISSION_MAKE: 'permission/make-permission',
  },
  
  TABLE: {
    USERS: "users",
    STUDENT: "students",
    TEACHER: "teacher",
    COURSE: "course",
    NEWS:'news',

    USER_INFO: "UserInfo",

    NEW_SEWING_CHALLAN: 'NewSewingChallan',
    NEW_SEWING_CHALLAN_DETAILS: 'NewSewingChallanDetails',
    NEW_SEWING_CHALLAN_SUMMARY: 'NewSewingChallanSummary',
    NEW_WASH_CHALLAN: 'NewWashChallanMaster',
    NEW_WASH_CHALLAN_DETAILS: 'NewWashChallanDetails',
    NEW_WASH_CHALLAN_SUMMARY: 'NewWashChallanSummary',

    SEWING_CHALLAN_REJECT_HISTORY: 'SewingChallanRejectHistory',
    WASH_CHALLAN_REJECT_HISTORY: 'WashChallanRejectHistory',
    WASH_CHECKING: 'WashChecking',
    FINISHING_CHECKING: 'FinishingChecking',

    CP_STYLE: "CP_Style"
  },

  VIEW: {
    BUYER: 'View_Buyer'
  },

  MESSAGE: {
    SERVER_ERROR: {
      CONTENT: "Internal server error",
      STATUS_CODE: 500
    },
    UNAUTHORIZED: {
      CONTENT: "Unauthorized",
      STATUS_CODE: 401
    },
    SUCCESS_GET: {
      CONTENT: "Successfully getting data from server",
      STATUS_CODE: 200,
    },
    BAD_REQUEST: {
      CONTENT: "Bad request",
      STATUS_CODE: 400
    }
  },

  SOCKET: {
    NOTIFY_CHALLAN: "notify-challan"
  }
};
