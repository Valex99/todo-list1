import { createAndAppendTasks } from "./UI";

const projects = [];

function Project(name) {
  console.log(projects);
  return { name, tasks: [] }; // Each project has tasks
}

function addProject(name) {
  const newProject = Project(name);
  projects.push(newProject);
  return newProject;
}

function getAllProjects() {
  return projects;
}

function removeProject(name) {
  const index = projects.findIndex((project) => project.name === name);
  if (index !== -1) {
    projects.splice(index, 1);
  }
}

function initializeDefaultProject() {
  const allProjects = getAllProjects();
  if (allProjects.length === 0) {
    addProject("Default Project");
  }
}

// Function to track last added project
function getLastAddedProject() {
  return projects.length > 0 ? projects[projects.length - 1] : null;
}

function taskAmount(selectedProject) {
  const currentProject = findProjectName(selectedProject);
  const taskAmount = currentProject.tasks.length;
  return taskAmount;
}

function projectCout() {
  return projects.length;
}

function changeName(oldName, newName) {
  // findIndex method expects a callback function
  const index = projects.findIndex((project) => project.name === oldName);
  // Create a new object with the updated name but keep the other properties the same
  const updatedProject = { ...projects[index], name: newName };
  // at index, take out 1 item and add updatedProject item instead
  projects.splice(index, 1, updatedProject);
  return projects;
}

function addTaskToSelectedProject(
  selectedProject,
  taskDescription,
  taskPriority
) {
  const currentProject = findProjectName(selectedProject);

  currentProject.tasks.push({ name: taskDescription, priority: taskPriority });
  console.log("Task succesfully added to", selectedProject);
  console.log(projects);
}

function displayAllTasksForSelectedProject(selectedProject) {
  // 1 -> Find selected project - stored in currentProject const
  const currentProject = findProjectName(selectedProject);

  sortTasksByPriority(selectedProject);
  // 2 -> For each task of that selected project call createAndAppendTasks
  currentProject.tasks.forEach((task) => {
    // 3 -> Pass in as an argument (task name and task priority)
    createAndAppendTasks(task.name, task.priority);
  });
}

function removeTaskFromArray(selectedProject, taskName) {
  const currentProject = findProjectName(selectedProject);

  const taskIndex = currentProject.tasks.findIndex(
    (task) => task.name === taskName
  );

  currentProject.tasks.splice(taskIndex, 1);

  console.log(projects);
}

// Inner function to avoid DRY
function findProjectName(selectedProject) {
  const currentProject = projects.find(
    (project) => project.name === selectedProject
  );
  return currentProject;
}

function changeTaskName(selectedProject, oldName, newName, priority) {
  // Find Selected Project
  const currentProject = findProjectName(selectedProject);
  // Find INDEX of the task with oldName
  const taskIndex = currentProject.tasks.findIndex(
    (task) => task.name === oldName
  );

  // Update the task name
  currentProject.tasks[taskIndex].name = newName;
  currentProject.tasks[taskIndex].priority = priority;
  //return projects;
  return sortTasksByPriority(selectedProject);
}

function checkForDuplication(projectName) {
  if (findProjectName(projectName)) {
    return false;
  } else {
    return true;
  }
}

function sortTasksByPriority(selectedProject) {
  const currentProject = findProjectName(selectedProject);

  // Priority order mapping - sort method works with numbers
  const priorityOrder = {
    "first-priority": 1,
    "second-priority": 2,
    "third-priority": 3,
  };

  // sort() function takes a comparion function as an argument
  // It takes in 2 arguments (a and b) to determine their order
  currentProject.tasks.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
// I could make a function for finding / querying project name since i use it often in here
export {
  addProject,
  getAllProjects,
  removeProject,
  initializeDefaultProject,
  getLastAddedProject,
  taskAmount,
  projectCout,
  changeName,
  addTaskToSelectedProject,
  displayAllTasksForSelectedProject,
  removeTaskFromArray,
  changeTaskName,
  checkForDuplication,
};

// Figure out how can you import all of those three things to UI module.

// WHAT SHOULD HAPPEN WHEN A CERTAIN PROJECT IS CLICKED?
// 1) Selected element should get highlighted
// DONE //  Div below nav bar should get name of clicked project
// Edit and Delete icons should work for that specific project
// Bin icon should NOT work if this is the ONLY project in the projects arr

// Make sure the last created project is always selected