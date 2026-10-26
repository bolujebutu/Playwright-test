// utils/constants.js
// Central config for URLs, credentials and shared test data

const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

// Public demo credentials published by OrangeHRM. Not a secret.
const CREDENTIALS = {
  admin: {
    username: 'Admin',
    password: 'admin123',
  },
};

const ROUTES = {
  login:             '/web/index.php/auth/login',
  dashboard:         '/web/index.php/dashboard/index',
  pim:               '/web/index.php/pim/viewEmployeeList',
  addEmployee:       '/web/index.php/pim/addEmployee',
  leave:             '/web/index.php/leave/viewLeaveList',
  leaveAssign:       '/web/index.php/leave/assignLeave',
  recruitment:       '/web/index.php/recruitment/viewJobVacancy',
  performance:       '/web/index.php/performance/searchEvaluatePerformanceReview',
  admin:             '/web/index.php/admin/viewSystemUsers',
  adminJobTitles:    '/web/index.php/admin/viewJobTitleList',
  adminPayGrades:    '/web/index.php/admin/viewPayGrades',
  adminLocations:    '/web/index.php/admin/viewLocations',
  myInfo:            '/web/index.php/pim/viewMyDetails',
  timesheet:         '/web/index.php/time/viewMyTimesheet',
  punchIn:           '/web/index.php/attendance/punchIn',
  myAttendance:      '/web/index.php/attendance/viewMyAttendanceRecord',
  directory:         '/web/index.php/directory/viewDirectory',
  buzz:              '/web/index.php/buzz/viewBuzz',
};

// Returns a date `daysAhead` days from today as YYYY-MM-DD, moved forward to a weekday
function futureWeekday(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const TEST_DATA = {
  employee: {
    firstName:  'TestAuto',
    middleName: 'QA',
    lastName:   'Playwright',
    // Employee Id allows 10 characters; the timestamp keeps it unique per run
    employeeId: `AUTO${Date.now().toString().slice(-6)}`,
  },
  leave: {
    startDate: futureWeekday(60),
    endDate:   futureWeekday(62),
    comment:   'Automated test leave request',
  },
  leaveFilter: {
    fromDate: '2024-01-01',
    toDate:   '2024-12-31',
  },
};

module.exports = { BASE_URL, CREDENTIALS, ROUTES, TEST_DATA };
