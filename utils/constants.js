// utils/constants.js
// Central config for URLs, credentials and shared test data

const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

const CREDENTIALS = {
  admin: {
    username: 'Admin',
    password: 'admin123',
  },
};

const ROUTES = {
  login:       '/web/index.php/auth/login',
  dashboard:   '/web/index.php/dashboard/index',
  pim:         '/web/index.php/pim/viewEmployeeList',
  addEmployee: '/web/index.php/pim/addEmployee',
  leave:       '/web/index.php/leave/viewLeaveList',
  leaveAssign: '/web/index.php/leave/assignLeave',
  recruitment: '/web/index.php/recruitment/viewJobVacancy',
  performance: '/web/index.php/performance/searchPerformanceReview',
  admin:       '/web/index.php/admin/viewSystemUsers',
  myInfo:      '/web/index.php/pim/viewMyDetails',
  timesheet:   '/web/index.php/time/viewMyTimesheet',
  directory:   '/web/index.php/directory/searchDirectory',
  buzz:        '/web/index.php/buzz/viewBuzz',
};

const TEST_DATA = {
  employee: {
    firstName: 'TestAuto',
    middleName: 'QA',
    lastName:   'Playwright',
    employeeId: `AUTO${Date.now().toString().slice(-5)}`,
  },
  leave: {
    type:      'Annual Leave',
    startDate: '2025-12-01',
    endDate:   '2025-12-01',
    comment:   'Automated test leave request',
  },
  jobVacancy: {
    title:       'QA Engineer Automation',
    description: 'Playwright automation vacancy',
  },
};

module.exports = { BASE_URL, CREDENTIALS, ROUTES, TEST_DATA };
