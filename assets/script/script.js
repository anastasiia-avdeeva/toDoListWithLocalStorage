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

function toggleElemDisplayState(elem, displayType) {
  elem.style.display = displayType;
}

function createTaskObj(taskDescpription) {
  return { task: taskDescpription, done: false };
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
  taskDescpriptionElem.textContent = taskObj.task;

  liElem.append(checkboxElem, taskDescpriptionElem);
  return liElem;
}

function updateTaskListVisibility() {
  if (tasks.length === 0) {
    toggleElemDisplayState(taskLst, "flex");
    toggleElemDisplayState(emptyMsg, "none");
  }
}

function renderTask(taskObj) {
  const taskElem = createTaskLI(taskObj);
  taskLst.append(taskElem);
}

function updateLocalStorage(taskObj) {
  tasks.push(taskObj);
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
}

function disableOrEnableBtn(disable = true) {
  disable
    ? taskBtn.setAttribute("disabled", true)
    : taskBtn.removeAttribute("disabled");
}

function processInput(evt) {
  evt.preventDefault();
  const task = inputField.value.trim();

  if (!task) return;

  updateTaskListVisibility();
  const taskObj = createTaskObj(task);
  renderTask(taskObj);
  disableOrEnableBtn();
  updateLocalStorage(taskObj);
  inputField.value = "";
}

form.addEventListener("submit", processInput);

// console.log(JSON.parse(localStorage.getItem("tasks")));
// localStorage.clear();

function toggleTaskState() {
  return;
}
form.addEventListener("click", toggleTaskState);
