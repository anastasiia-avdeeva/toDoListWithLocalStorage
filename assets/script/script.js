const form = document.getElementById("form");
const inputField = document.getElementById("taskInput");
const taskLst = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
const taskBtn = document.querySelector(".tasks__btn");
let tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];

const taskClassNames = {
  taskClassName: "tasks__task",
  checkboxClassName: "tasks__task-checkbox",
  taskDescriptionClassName: "tasks__task-description",
  checkedTaskClassName: "tasks__task-description--checked",
};

function makeTaskListVisibile() {
  toggleElemDisplayState(taskLst, "flex");
  toggleElemDisplayState(emptyMsg, "none");
}

function createElemWithClass(tagName, className) {
  const newElem = document.createElement(tagName);
  newElem.classList.add(className);
  return newElem;
}

function createTaskLI(taskObj) {
  const liElem = createElemWithClass("li", taskClassNames.taskClassName);

  const checkboxElem = createElemWithClass(
    "span",
    taskClassNames.checkboxClassName
  );

  const taskDescpriptionElem = createElemWithClass(
    "span",
    taskClassNames.taskDescriptionClassName
  );
  taskDescpriptionElem.textContent = taskObj.taskName;

  liElem.append(checkboxElem, taskDescpriptionElem);
  return liElem;
}

function renderTask(taskObj) {
  const taskElem = createTaskLI(taskObj);
  taskLst.append(taskElem);
  if (taskObj.taskDone) {
    markTaskElemDone(taskElem);
  }
}

function renderAllTasks() {
  for (let task of tasks) {
    renderTask(task);
  }
}

function toggleBtnState(disable = true) {
  disable
    ? taskBtn.setAttribute("disabled", true)
    : taskBtn.removeAttribute("disabled");
}

function renderFromLocalStorage() {
  if (tasks.length === 0) {
    makeEmptyMsgVisible();
    console.log("local storage is empty");
    return;
  }

  makeTaskListVisibile();
  renderAllTasks();
  toggleBtnState(false);
}

document.addEventListener("DOMContentLoaded", renderFromLocalStorage);

function toggleElemDisplayState(elem, displayType) {
  elem.style.display = displayType;
}

function createTaskObj(taskDescpription) {
  return { taskName: taskDescpription, taskDone: false };
}

function makeEmptyMsgVisible() {
  toggleElemDisplayState(taskLst, "none");
  toggleElemDisplayState(emptyMsg, "block");
}

function markTaskElemDone(taskElem) {
  const checkboxElem = taskElem.querySelector(
    "." + taskClassNames.checkboxClassName
  );
  const taskDescpriptionElem = taskElem.querySelector(
    "." + taskClassNames.taskDescriptionClassName
  );

  checkboxElem.textContent = "\u2713";
  taskDescpriptionElem.classList.add(taskClassNames.checkedTaskClassName);
}

function updateLocalStorage(taskObj) {
  tasks.push(taskObj);
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
}

function processInput(evt) {
  evt.preventDefault();
  const task = inputField.value.trim();

  if (!task) return;

  if (tasks.length === 0) makeTaskListVisibile();
  const taskObj = createTaskObj(task);
  renderTask(taskObj);
  toggleBtnState(false);
  updateLocalStorage(taskObj);
  inputField.value = "";
}

form.addEventListener("submit", processInput);

function toggleTick(listItemElem, taskIsDone) {
  const checkbox = listItemElem.querySelector(
    "." + taskClassNames.checkboxClassName
  );
  taskIsDone ? (checkbox.textContent = "\u2713") : (checkbox.textContent = "");
}

function markTaskObjDone(taskDescpription, taskIsDone) {
  for (let task of tasks) {
    if (task.taskName === taskDescpription) {
      task.taskDone = taskIsDone;
      break;
    }
  }
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleTaskState(event) {
  const clickedTaskElem = event.target.closest(
    "." + taskClassNames.taskClassName
  );
  if (!clickedTaskElem) return;

  const taskDescpriptionElem = clickedTaskElem.querySelector(
    `.${taskClassNames.taskDescriptionClassName}`
  );
  taskDescpriptionElem.classList.toggle(taskClassNames.checkedTaskClassName);

  const taskIsDone = taskDescpriptionElem.classList.contains(
    taskClassNames.checkedTaskClassName
  );
  toggleTick(clickedTaskElem, taskIsDone);

  const taskDescription = taskDescpriptionElem.textContent;
  markTaskObjDone(taskDescription, taskIsDone);
}

taskLst.addEventListener("click", toggleTaskState);

function removeTasksFromDom() {
  const taskElemsArr = taskLst.querySelectorAll(".tasks__task");
  taskElemsArr.forEach((item) => item.remove());
}

function removeTasks() {
  removeTasksFromDom();
  tasks = [];
  localStorage.removeItem("tasks");
  makeEmptyMsgVisible();
  toggleBtnState();
}

taskBtn.addEventListener("click", removeTasks);
