const connection = require("./connection");

class DB {
  // Keeping a reference to the connection on the class in case we need it later
  constructor(connection) {
    this.connection = connection;
  }

  // Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
  findAllEmployees() {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

  // Create a new employee
  createEmployee(employee) {
    return this.connection.query("INSERT INTO employee SET ?", employee);
  }

  // Remove an employee with the given id
  removeEmployee(employeeId) {
    return this.connection.query(
      "DELETE FROM employee WHERE id = ?",
      employeeId
    );
  }


  // Update the given employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    );
  }

  // Find all employees except the given employee id
  findAllEmployeesButSelected(employeeId) {
    return this.connection.query(
      "SELECT * FROM employee where id != ?",
      employeeId
    );  
  }
  
  // Update the given employee's manager
  updateEmployeeManager(employeeId, managerId) {
    return this.connection.query(
      "UPDATE employee SET manager_id = ? WHERE id = ?",
      [managerId, employeeId]
    );
  }

  // Find all roles, join with departments to display the department name
  findAllRoles() {
    return this.connection.query(
      "SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department on role.department_id = department.id",
    );
  }
  // Create a new role
  createRole(role) {
    return this.connection.query(
      "INSERT INTO role SET ?", 
      role
    );
  }

  // Remove a role from the db
  removeRole(roleId) {
    return this.connection.query(
      "DELETE FROM role WHERE id = ?",
      roleId
    );
  }

  // Find all departments, join with employees and roles and sum up utilized department budget
  findAllDepartments() {
    return this.connection.query(
      "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name"
    );

  }
  
  // Create a new department
  createDepartment(department) {
    return this.connection.query(
      "INSERT INTO department SET ?",
      department
    );
  }

  // Remove a department
  removeDepartment(deptId) {
    return this.connection.query(
      "DELETE FROM department WHERE id = ?",
      deptId
    );
  }

  // Find all employees in a given department, join with roles to display role titles
  findAllEmployeesByDepartment(deptId) {
    return this.connection.query(
      "SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS name, role.title, role.salary FROM employee LEFT JOIN role on employee.role_id = role.id WHERE role.department_id = ?",
      deptId
    );
  }

  // Find all employees by manager, join with departments and roles to display titles and department names
  findAllEmployeesByManager(managerId) {
    return this.connection.query(
      "SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS name, department.name, role.title, role.salary FROM employee LEFT JOIN department on role.department_id = department.id WHERE employee.manager_id = ?",
      managerId
    );
  }
}
module.exports = new DB(connection);
