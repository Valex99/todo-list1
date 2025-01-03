import binIcon from "../icons/bin-icon.png";
import pencilIcon from "../icons/pencil-outline.png";
import plusIcon from "../icons/plus.png";
import projectIcon from "../images/check-icon.png";
import {
  addProject,
  getAllProjects,
  getLastAddedProject,
  removeProject,
  initializeDefaultProject,
  taskAmount,
  projectCout,
  changeName,
  addTaskToSelectedProject,
  displayAllTasksForSelectedProject,
  removeTaskFromArray,
  changeTaskName,
  checkForDuplication,
} from "./logic.js";

let selected = null;
let selectedTask = null;
const content = document.getElementById("content");
const html = document.querySelector("html");

let noTasksDivMessageExists = false;

export function createNav() {
  const nav = document.querySelector("nav");

  const navDiv = document.createElement("div");
  navDiv.classList.add("nav-div");

  const icon = document.createElement("img");
  icon.classList.add("icon");
  icon.src = projectIcon;
  icon.alt = "ToDo Icon";

  const title = document.createElement("h1");
  title.classList.add("project-title");
  title.textContent = "TODO List";

  const githubButton = document.createElement("a");
  githubButton.classList.add("github-button");
  githubButton.textContent = "View on Github";
  githubButton.href = "https://github.com/Valex99/todo-list1";

  navDiv.appendChild(icon);
  navDiv.appendChild(title);
  navDiv.appendChild(githubButton);

  nav.appendChild(navDiv);

  // FUNCTION CALLS:
  // First call so taskdiv gets created - to append later
  taskDivContainer();
  // When nav is created add default project to projects array
  initializeDefaultProject();
  // Update selected ->
  selected = getLastAddedProject().name;

  // Create header element
  createProjectHeader();
}

// Function that creates selected project header
function createProjectHeader() {
  const currentProjectDiv = document.createElement("div");
  currentProjectDiv.classList.add("current-project-div");

  content.appendChild(currentProjectDiv);

  updateProjectHeader();
  projectSidebar(); // Once header is created, append sidebar to it
  createAddTask();
}

// Update project header -> last added project
function updateProjectHeader() {
  const projectHeader = document.querySelector(".current-project-div");
  const lastAddedProject = getLastAddedProject().name;
  projectHeader.textContent = lastAddedProject;

  appendHeaderIcons();
}

function appendHeaderIcons() {
  const currentProjectDivIcons = document.createElement("div");
  currentProjectDivIcons.classList.add("current-project-div-icons");

  const currentProjectDiv = document.querySelector(".current-project-div");

  const bin = document.createElement("img");
  bin.src = binIcon;
  bin.alt = "Bin Icon";

  const pencil = document.createElement("img");
  pencil.src = pencilIcon;
  pencil.alt = "Pencil Icon";

  currentProjectDivIcons.appendChild(pencil);
  currentProjectDivIcons.appendChild(bin);

  currentProjectDiv.appendChild(currentProjectDivIcons);

  pencil.addEventListener("click", () => {
    editProjectName();
  });

  bin.addEventListener("click", () => {
    // Check if there is more than one project present
    if (projectCout() <= 1) {
      alert("App requires a minimum of one project!");
    } else {
      removeProject(selected);
      const selectedProject = document.querySelector(".selected");
      const projectSidebarParent = document.querySelector(
        ".project-sidebar-parent-div"
      );
      projectSidebarParent.removeChild(selectedProject); // Remove project

      selected = getLastAddedProject().name; // set selected to last project in the projects array

      const taskContainer = document.querySelector(".task-container");
      taskContainer.innerHTML = "";

      // If message existed before removing the project and clearing innerHtml
      // Make sure to set var to fales so it can be displayed afain if needed
      if (noTasksDivMessageExists === true) {
        noTasksDivMessageExists = false;
      }

      if (taskAmount(selected) === 0 && noTasksDivMessageExists === false) {
        noTasksDivMessage();
      } else {
        displayAllTasksForSelectedProject(selected);
      }

      // Select last project in the array -> Highlight it and set header text content
      updateProjectHeader();

      const remainingProjects = document.querySelectorAll(".project");
      remainingProjects.forEach((project) => {
        const projectName = project.querySelector("p").textContent;
        if (projectName === selected) {
          project.classList.add("selected");
          project.querySelector(".task-counter").classList.add("selected-p");
        }
      });
    }
  });
}

function projectSidebar() {
  const projectSidebarParentDiv = document.createElement("div");
  projectSidebarParentDiv.classList.add("project-sidebar-parent-div");

  const projectSidebar = document.createElement("div");
  projectSidebar.classList.add("project-sidebar");
  projectSidebar.textContent = "Projects";

  const plus = document.createElement("img");
  plus.src = plusIcon;
  plus.alt = "Plus Icon";

  projectSidebar.appendChild(plus);
  content.appendChild(projectSidebar);
  projectSidebarParentDiv.appendChild(projectSidebar);
  content.appendChild(projectSidebarParentDiv);

  plus.addEventListener("click", () => {
    displayProjectModal();
  });

  renderNewProject(); // Render ALL projects
}

// Function to display ADD PROJECT modal
function displayProjectModal() {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Add New Project";

  const closeButton = document.createElement("button");
  closeButton.classList.add("modal-close");
  closeButton.textContent = "✕";

  const inputContainer = document.createElement("div");
  const inputLabel = document.createElement("label");
  inputLabel.textContent = "Name*";
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "Enter project name";

  inputContainer.appendChild(inputLabel);
  inputContainer.appendChild(inputField);

  const submitButton = document.createElement("button");
  submitButton.classList.add("modal-submit");
  submitButton.textContent = "SUBMIT";

  modalContent.appendChild(modalTitle);
  modalContent.appendChild(closeButton);
  modalContent.appendChild(inputContainer);
  modalContent.appendChild(submitButton);
  modalOverlay.appendChild(modalContent);

  document.body.appendChild(modalOverlay);

  closeButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });

  submitButton.addEventListener("click", () => {
    const projectName = inputField.value.trim();
    if (checkForDuplication(projectName)) {
      if (projectName) {
        const taskContainer = document.querySelector(".task-container");
        taskContainer.innerHTML = "";
        noTasksDivMessage();

        selected = projectName;
        addProject(projectName); // Add new project to projects array
        renderNewProject(); // Then display new project

        document.body.removeChild(modalOverlay); // Hide modal
      } else {
        alert("Project name is required!");
      }
    } else {
      alert("Project name already exists!");
    }
  });
}

// Rendering new projects
function renderNewProject() {
  const projectSidebarParent = document.querySelector(
    ".project-sidebar-parent-div"
  );

  const projectDiv = document.createElement("div");
  const projectName = document.createElement("p");
  const lastAddedProject = getLastAddedProject().name;

  removeSelectedClass();

  updateProjectHeader();

  projectName.textContent = lastAddedProject;
  projectDiv.classList.add("project");
  projectDiv.classList.add("selected");

  const taskCounter = document.createElement("p");
  taskCounter.classList.add("task-counter");
  taskCounter.classList.add("selected-p");

  if (taskAmount(selected) === 0 && noTasksDivMessageExists === false) {
    noTasksDivMessage();
  } else {
    console.log("task amount is bigger than 0");
  }

  taskCounter.textContent = taskAmount(selected);

  projectDiv.appendChild(projectName);
  projectDiv.appendChild(taskCounter);
  projectSidebarParent.appendChild(projectDiv);

  // Add event listener to each project div
  projectDiv.addEventListener("click", () => {
    removeSelectedClass(); // Clear any selected class first

    const currentProjectDiv = document.querySelector(".current-project-div");

    projectDiv.classList.add("selected");
    projectDiv.querySelector(".task-counter").classList.add("selected-p");
    selected = projectName.textContent;
    console.log("SELECTED: ", selected);
    currentProjectDiv.textContent = selected;
    appendHeaderIcons();

    // Clear task-container as well (bin icon should do the same)
    const taskContainer = document.querySelector(".task-container");
    taskContainer.innerHTML = "";

    noTasksDivMessageExists = false;

    if (taskAmount(selected) === 0 && noTasksDivMessageExists === false) {
      noTasksDivMessage();
    } else {
      displayAllTasksForSelectedProject(selected);
    }

    taskAmount(selected);
  });
}

// If there is any project with class selected - remove it
function removeSelectedClass() {
  const selected = document.querySelector(".selected");
  const selectedTaskCounter = document.querySelector(".selected-p");
  if (selected) {
    selected.classList.remove("selected");
    selectedTaskCounter.classList.remove("selected-p");
  }
}

// Edit Project name modal
function editProjectName() {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Edit Project Name";

  const closeButton = document.createElement("button");
  closeButton.classList.add("modal-close");
  closeButton.textContent = "✕";

  const inputContainer = document.createElement("div");
  const inputLabel = document.createElement("label");
  inputLabel.textContent = "Name";
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = selected;

  inputContainer.appendChild(inputLabel);
  inputContainer.appendChild(inputField);

  const submitButton = document.createElement("button");
  submitButton.classList.add("modal-submit");
  submitButton.textContent = "SUBMIT";

  modalContent.appendChild(modalTitle);
  modalContent.appendChild(closeButton);
  modalContent.appendChild(inputContainer);
  modalContent.appendChild(submitButton);
  modalOverlay.appendChild(modalContent);

  document.body.appendChild(modalOverlay);

  closeButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });

  submitButton.addEventListener("click", () => {
    const newName = inputField.value.trim();

    if (checkForDuplication(newName)) {
      if (newName && newName !== selected) {
        changeName(selected, newName);
        selected = newName;

        const projectHeader = document.querySelector(".current-project-div");
        const selectedProject = document.querySelector(".selected");

        selectedProject.querySelector("p").textContent = selected;
        projectHeader.textContent = selected;

        appendHeaderIcons();

        const taskContainer = document.querySelector(".task-container");
        // This was added in case of any problem
        taskContainer.innerHTML = "";
        console.log(noTasksDivMessageExists);
        noTasksDivMessageExists = false;

        if (taskAmount(selected) === 0 && noTasksDivMessageExists === false) {
          noTasksDivMessage();
        } else {
          taskContainer.innerHTML = "";
          displayAllTasksForSelectedProject(selected);
        }
        document.body.removeChild(modalOverlay);
      } else {
        alert("Project name is required!");
      }
    } else {
      alert("Project name already exists!");
    }
  });
}

function createAddTask() {
  const addTaskDiv = document.createElement("div");
  addTaskDiv.classList.add("circle-div");

  const plus = document.createElement("p");
  plus.classList.add("plus");
  plus.textContent = "+";

  addTaskDiv.appendChild(plus);
  html.appendChild(addTaskDiv);

  addTaskDiv.addEventListener("click", () => {
    displayTaskModal();
  });
}

function taskDivContainer() {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task-container");
  content.appendChild(taskContainer);
}

function noTasksDivMessage() {
  const taskContainer = document.querySelector(".task-container");

  const emptyTaskDiv = document.createElement("div");
  emptyTaskDiv.classList.add("empty-task-div");
  emptyTaskDiv.textContent = "No tasks for slected project were found";
  taskContainer.appendChild(emptyTaskDiv);

  noTasksDivMessageExists = true;
}

function displayTaskModal() {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Add New Task";

  const closeButton = document.createElement("button");
  closeButton.classList.add("modal-close");
  closeButton.textContent = "✕";

  const descriptionContainer = document.createElement("div");
  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Description*";
  const descriptionTextarea = document.createElement("textarea");
  descriptionTextarea.placeholder = "Enter task description";
  descriptionTextarea.rows = 4;

  descriptionContainer.appendChild(descriptionLabel);
  descriptionContainer.appendChild(descriptionTextarea);

  const priorityContainer = document.createElement("div");
  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Priority*";
  const prioritySelect = document.createElement("select");
  const priorities = ["First Priority", "Second Priority", "Third Priority"];
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority.toLowerCase().replace(" ", "-");
    option.textContent = priority;
    prioritySelect.appendChild(option);
  });

  priorityContainer.appendChild(priorityLabel);
  priorityContainer.appendChild(prioritySelect);

  const submitButton = document.createElement("button");
  submitButton.classList.add("modal-submit");

  submitButton.textContent = "SUBMIT";

  modalContent.appendChild(modalTitle);
  modalContent.appendChild(closeButton);
  modalContent.appendChild(descriptionContainer);
  modalContent.appendChild(priorityContainer);
  modalContent.appendChild(submitButton);
  modalOverlay.appendChild(modalContent);

  document.body.appendChild(modalOverlay);

  closeButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });

  ////////////
  submitButton.addEventListener("click", () => {
    const description = descriptionTextarea.value.trim();
    const priority = prioritySelect.value;

    if (description.length === 0) {
      alert("Description is required!");
      return 0;
    }

    if (noTasksDivMessageExists === true) {
      removeNoTaskDivMessage();
    }

    const taskContainer = document.querySelector(".task-container");
    taskContainer.innerHTML = "";

    addTaskToSelectedProject(selected, description, priority);

    selectedTask = description;
    // add code here to push description and priority into array
    const selectedProject = document.querySelector(".selected");
    const selectedTaskCounter = selectedProject.querySelector(".task-counter");
    selectedTaskCounter.textContent = taskAmount(selected);

    displayAllTasksForSelectedProject(selected);

    if (description) {
      console.log("New Task:", { description, priority });
      document.body.removeChild(modalOverlay);
    } else {
      alert("Description is required!");
    }
  });
}

// Only called by display all tasks from logic.js
export function createAndAppendTasks(description, priority) {
  const taskContainer = document.querySelector(".task-container");

  const task = document.createElement("div");
  task.classList.add("task");
  // This should be a description of the task
  // Get value from projects array
  task.textContent = description;

  // Color should be picked with IF (add class list to it)
  const priorityDiv = document.createElement("div");
  priorityDiv.classList.add("priority-div");

  if (priority == "first-priority") {
    priorityDiv.classList.add("blue");
  } else if (priority == "second-priority") {
    priorityDiv.classList.add("orange");
  } else {
    priorityDiv.classList.add("lightblue");
  }

  task.appendChild(priorityDiv);
  taskContainer.appendChild(task);
  appendTaskIcons(task); // No argument was given to that function, thats why there was an error
}

function removeNoTaskDivMessage() {
  const taskContainer = document.querySelector(".task-container");
  const emptyTaskDiv = document.querySelector(".empty-task-div");

  taskContainer.removeChild(emptyTaskDiv);
  noTasksDivMessageExists = false;
}

function editTaskModal(taskName, taskElement) {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = "Edit task";

  const closeButton = document.createElement("button");
  closeButton.classList.add("modal-close");
  closeButton.textContent = "✕";

  const descriptionContainer = document.createElement("div");
  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Description*";
  const descriptionTextarea = document.createElement("textarea");
  descriptionTextarea.placeholder = taskName;
  descriptionTextarea.rows = 4;

  descriptionContainer.appendChild(descriptionLabel);
  descriptionContainer.appendChild(descriptionTextarea);

  const priorityContainer = document.createElement("div");
  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Priority*";
  const prioritySelect = document.createElement("select");
  const priorities = ["First Priority", "Second Priority", "Third Priority"];
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority.toLowerCase().replace(" ", "-");
    option.textContent = priority;
    prioritySelect.appendChild(option);
  });

  priorityContainer.appendChild(priorityLabel);
  priorityContainer.appendChild(prioritySelect);

  const submitButton = document.createElement("button");
  submitButton.classList.add("modal-submit");

  submitButton.textContent = "SUBMIT";

  modalContent.appendChild(modalTitle);
  modalContent.appendChild(closeButton);
  modalContent.appendChild(descriptionContainer);
  modalContent.appendChild(priorityContainer);
  modalContent.appendChild(submitButton);
  modalOverlay.appendChild(modalContent);

  document.body.appendChild(modalOverlay);

  closeButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
  });
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });

  submitButton.addEventListener("click", () => {
    const description = descriptionTextarea.value.trim();
    const priority = prioritySelect.value;

    if (description.length === 0) {
      alert("Description is required!");
      return 0;
    }

    const taskContainer = document.querySelector(".task-container");
    taskElement.textContent = description;

    // Color should be picked with IF (add class list to it)
    const priorityDiv = document.createElement("div");
    priorityDiv.classList.add("priority-div");

    if (priority == "first-priority") {
      priorityDiv.classList.add("blue");
    } else if (priority == "second-priority") {
      priorityDiv.classList.add("orange");
    } else {
      priorityDiv.classList.add("lightblue");
    }

    changeTaskName(selected, taskName, description, priority);

    taskContainer.innerHTML = "";
    displayAllTasksForSelectedProject(selected);
    //appendTaskIcons(taskElement);
    // Changes task name in logic.js
    //changeTaskName(selected, taskName, description, priority);

    taskElement.appendChild(priorityDiv);
    document.body.removeChild(modalOverlay);

    // WHEN YOU CHANGE TASK NAME -> Push that name into array as well
  });
}

function appendTaskIcons(taskElement) {
  // This is probably wrong!
  //const task = document.querySelector(".task");

  const taskContainer = document.querySelector(".task-container");

  const iconsDiv = document.createElement("div");
  iconsDiv.classList.add("icons-div");

  const editIcon = document.createElement("img");
  editIcon.classList.add("task-icon");
  editIcon.classList.add("edit-icon");
  editIcon.src = pencilIcon;
  editIcon.alt = "Edit Icon";

  const deleteIcon = document.createElement("img");
  deleteIcon.classList.add("task-icon");
  deleteIcon.classList.add("delete-icon");
  deleteIcon.src = binIcon;
  deleteIcon.alt = "Delete Icon";

  iconsDiv.appendChild(editIcon);
  iconsDiv.appendChild(deleteIcon);

  taskElement.appendChild(iconsDiv);

  taskContainer.appendChild(taskElement);
  //taskContainer.appendChild(task); WORKS

  // ADD EVENT LISTENERS FOR PENCIL AND BIN ICON
  editIcon.addEventListener("click", function (e) {
    // taskElement now holds the reference to last selected tasks div
    const taskElement = e.target.closest(".task");
    const taskName = taskElement.textContent;
    console.log("selected task is: ", taskName);
    editTaskModal(taskName, taskElement);
  });

  // WORKS
  deleteIcon.addEventListener("click", function (e) {
    const taskElement = e.target.closest(".task");
    const taskName = taskElement.textContent;

    taskContainer.removeChild(taskElement);

    removeTaskFromArray(selected, taskName);

    // Update task count for specific project
    const selectedProject = document.querySelector(".selected");
    const selectedTaskCounter = selectedProject.querySelector(".task-counter");
    selectedTaskCounter.textContent = taskAmount(selected);

    if (taskAmount(selected) === 0) {
      noTasksDivMessage();
    }
  });

  // ADD EVENT LISTENER TO MAKE TASK MARKED
  taskElement.addEventListener("click", function (e) {
    const taskElement = e.target.closest(".task");
    const taskName = taskElement.textContent;

    // ON THE CLICK ->
    // Call function that checks for specific project IF that task is completed
    // Add to tasks array marked boolean

    console.log("Task element with task name:", taskName, "clicked");
  });
}

//1 Create local storage!

//2 FIGURE IT OUT WITH GIT...

//3 Click on the task should add it to completed - line over text, less opacity