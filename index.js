const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View Employess by Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View Employees by Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "View All Employee Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "Add Employee Role",
          value: "ADD_EMPLOYEE_ROLE"
        },
        {
          name: "Remove Employee Role",
          value: "REMOVE_EMPLOYEE_ROLE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]);

  // Call the appropriate function depending on what the user chose
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDept();
    case "VIEW_EMPLOYEES_BY_MANAGER":
      return viewEmployeesByManager();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    case "VIEW_ROLES":
      return viewRoles();
    case "ADD_EMPLOYEE_ROLE":
      return addRole();
    case "REMOVE_EMPLOYEE_ROLE":
      return removeRole();
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole();
    case "UPDATE_EMPLOYEE_MANAGER":
      return updateManager();
    case "VIEW_DEPARTMENTS":
      return viewDepts();
    case "ADD_DEPARTMENT":
      return addDept();
    case "REMOVE_DEPARTMENT":
      return removeDept();
    default:
      return quit();
  }
}
//View ALL employess
async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.log("\n");
  console.table(employees);
  console.log("You are now viewing ALL employees.")

  loadMainPrompts();
}

//Create viewEmployeesByDepartment function
async function viewEmployeesByDept() {
  const departments = await db.findAllDepartments();

  const deptChoices = departments.map(({ id, name}) => ({
    name: name,
    value: id
  }));

  const { deptId } = await prompt([
    {
      type: "list",
      name: "deptId",
      message: "Which department would you like to view its employees?",
      choices: deptChoices
    } 
  ]);

  const employees = await db.findAllEmployeesByDepartment(deptId);

  console.log("\n");
  console.table(employees);
  console.log("You are now viewing all the employees from this department.");

  loadMainPrompts();
}

//Create viewEmployeesByManager function
async function viewEmployeesByManager() {
  const managers = await db.findAllEmployees();

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which manager would you like to view its employees?",
      choices: managerChoices
    } 
  ]);

  const employees = await db.findAllEmployeesByManager();

  console.log("\n");
  console.table(employees);
  console.log("You are now viewing all the employees for this manager.");

  loadMainPrompts();
}

//Add Employee
async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "What is the employee's role?",
    choices: roleChoices
  });

  employee.role_id = roleId;

  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({ name: "None", value: null });

  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Who is the employee's manager?",
    choices: managerChoices
  });

  employee.manager_id = managerId;

  await db.createEmployee(employee);

  console.log(`Added ${employee.first_name} ${employee.last_name} to the database`);

  loadMainPrompts();
}

//Remove Employee
async function removeEmployee() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Removed employee from the database");

  loadMainPrompts();
}

//View Roles
async function viewRoles() {
  const roles = await db.findAllRoles();

  console.log("\n");
  console.table(roles);
  console.log("You are now viewing ALL roles.")

  loadMainPrompts();
}

//Add Role
async function addRole() {
  const departments = await db.findAllDepartments();
  const deptChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }))

  const role = await prompt([
    {
      name: "title",
      message: "What is the name of the new role?"
    },
    {
      name: "salary",
      message: "What is the salary?"
    },
    {
      type: "list",
      name: "department_id",
      message: "What department does this role belong to?",
      choices: deptChoices
    },
  ]);

  await db.createRole(role);

  console.log(`New Role: (${role.title}) added to the database.`);

  loadMainPrompts();
}

//Remove Role
async function removeRole() {
  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { roleId } = await prompt ([
    {
      type: "list",
      name: "roleId",
      message: "Which role would you like to remove?",
      choices: roleChoices
    }
  ]);

  await db.removeRole(roleId);

  console.log("\n");
  console.log("Removed the role from the database.");

  loadMainPrompts();
}


//Update Role
async function updateEmployeeRole() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role do you want to update?",
      choices: employeeChoices
    }
  ]);

  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee?",
      choices: roleChoices
    }
  ]);

  await db.updateEmployeeRole(employeeId, roleId);

  console.log("Updated employee's role");

  loadMainPrompts();
}

//Create updateEmployeeManager function
async function updateEmployeeManager() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's manager do you want to update?",
      choices: employeeChoices
    }
  ]);

  const manager = await db.findAllEmployeesButSelected(employeeId);

  const managerChoices = manager.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which manager do you want to assign the selected employee?",
      choices: managerChoices
    }
  ]);

  await db.updateEmployeeManager(employeeId, managerId);

  console.log("Updated employee's manager");

  loadMainPrompts();
}


//View Departments
async function viewDepts() {
  const dept = await db.findAllDepartments();

  console.log("\n");
  console.table(dept);
  console.log("You are now viewing ALL departments.")

  loadMainPrompts();
}

//Create addDepartment function
async function addDept() {
  const dept = await prompt([
    {
      name: "name",
      message: "What is the name of the new department?"
    }
  ]);

  await db.createDepartment(dept);

  console.log(`New Department: (${dept.name}) added to the database.`);

  loadMainPrompts();
}

//Create removeDepartment function
async function removeDept() {
  const departments = await db.findAllDepartments();

  const deptChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { deptId } = await prompt ([
    {
      type: "list",
      name: "deptId",
      message: "Which department would you like to remove?",
      choices: deptChoices
    }
  ]);

  await db.removeDepartment(deptId);

  console.log("\n");
  console.log("Removed the department from the database.");

  loadMainPrompts();
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}
