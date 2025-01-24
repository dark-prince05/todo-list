import "./style.css";
import deleteIcon from "../svg/delete.svg";
import editIcon from "../svg/edit.svg";
import { todo } from "./todo.js";
import { format } from "date-fns";

function todoList() {
  const todos = [];

  function createNewProject(id, name) {
    const newTodo = todo();
    todos.push({ id, name, todoName: newTodo });
  }

  function removeProject(id) {
    todos.splice(id, 1);
    todos.map((item, ind) => {
      item.id = ind;
    });
  }

  function addNewTask(ind, title, dueDate, priority) {
    todos[ind].todoName.addTodo(title, dueDate, priority);
  }

  function removeTask(todoInd, taskInd) {
    todos[todoInd].todoName.removeTodo(taskInd);
  }

  function editTask(todoInd, taskInd, title, dueDate, priority) {
    todos[todoInd].todoName.editTodo(taskInd, title, dueDate, priority);
  }

  return {
    addNewTask,
    removeTask,
    editTask,
    createNewProject,
    removeProject,
    getTodos: () => todos,
  };
}
const t = todoList();
t.createNewProject(0, "p1");
t.createNewProject(1, "p2");
t.createNewProject(2, "p3");
t.createNewProject(3, "p4");
t.addNewTask(0, "ddiiidd", "tttt", "dddd");
t.addNewTask(0, "ddeeeddd", "tttt", "dddd");
t.addNewTask(1, "ddeeedd", "tttt", "dddd");
t.addNewTask(2, "ddddkddd", "tttt", "dddd");
t.addNewTask(3, "dddiiid", "tttt", "dddd");
t.editTask(0, 0, "thala", "rrr", "898798");
console.log(t.getTodos()[0].todoName.getTodos());

function userInterface() {
  const projBtn = document.querySelector(".proj-add-btn");
  const projDialog = document.querySelector(".proj-dialog");
  const projAddBtn = document.querySelector(".proj-dialog-add");
  const projCancelBtn = document.querySelector(".proj-dialog-cancel");
  const projNameField = document.querySelector("input[name=proj-name-inp]");
  const projList = document.querySelector(".lists");
  const projTitle = document.querySelector(".project-title");

  const todos = todoList();
  todos.createNewProject(0, "Daily Routine");

  window.addEventListener("load", () => {
    renderProjects();
  });

  function renderProjects() {
    let currProjInd = 0;
    projList.childNodes.forEach((element, ind) => {
      if (element.classList.contains("active-proj")) {
        currProjInd = ind;
      }
    });
    projList.textContent = "";
    todos.getTodos().forEach((_, ind) => {
      const li = document.createElement("li");
      const delButton = document.createElement("img");
      delButton.src = deleteIcon;
      li.textContent = todos.getTodos()[ind].name;
      if (ind === currProjInd) {
        li.classList.add("active-proj");
        delButton.classList.add("proj-del-btn");
        delButton.id = ind;
        li.append(delButton);
      }

      li.id = todos.getTodos()[ind].id;
      projList.append(li);
    });
  }

  function addProject() {
    projBtn.addEventListener("click", () => {
      projNameField.value = "";
      projDialog.showModal();
    });

    projCancelBtn.addEventListener("click", () => {
      projDialog.close();
    });

    projAddBtn.addEventListener("click", () => {
      if (projNameField.value.trim() !== "") {
        const index = todos.getTodos().length;
        todos.createNewProject(index, projNameField.value);
      }
      renderProjects();
      renderTasks();
      projDialog.close();
    });
  }
  projDialog.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      projAddBtn.click();
    }
  });
  function todoFunctionalities() {
    projList.addEventListener("click", (e) => {
      projList.childNodes.forEach((node) => {
        if (node.classList && e.target.tagName.toLowerCase() == "li") {
          node.classList.remove("active-proj");
        }
      });
      if (e.target.tagName.toLowerCase() == "li") {
        e.target.classList.add("active-proj");
      }
      if (e.target.tagName.toLowerCase() === "img") {
        todos.removeProject(e.target.id);
      }
      renderProjects();
      renderTasks();
    });
  }

  function renderTasks() {
    projTitle.textContent = "";
    taskList.textContent = "";

    if (projList.childNodes.length === 0) return;
    let ind = 0;
    for (let node of projList.childNodes) {
      if (node.classList == "active-proj") {
        projTitle.textContent = todos.getTodos()[node.id].name;
        ind = node.id;
        break;
      }
      projTitle.textContent = "";
    }
    todos
      .getTodos()
      [ind].todoName.getTodos()
      .forEach((element) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("tasks", element.priority, "completed");

        const taskNameAndCheckBox = document.createElement("div");
        const taskCheckBox = document.createElement("input");
        taskCheckBox.type = "checkbox";
        taskCheckBox.name = "task-name";

        const taskCheckBoxLabel = document.createElement("label");
        taskCheckBoxLabel.htmlFor = "task-name";
        taskCheckBoxLabel.textContent = element.title;
        taskNameAndCheckBox.append(taskCheckBox);
        taskNameAndCheckBox.append(taskCheckBoxLabel);

        const taskDetails = document.createElement("div");
        const taskDueDate = document.createElement("div");
        if (element.dueDate) {
          taskDueDate.textContent = element.dueDate;
          taskDetails.append(taskDueDate);
        }
        const taskEditBtn = document.createElement("img");
        taskEditBtn.src = editIcon;
        const taskDeleteBtn = document.createElement("img");
        taskDeleteBtn.src = deleteIcon;
        taskDetails.append(taskEditBtn);
        taskDetails.append(taskDeleteBtn);

        taskDiv.append(taskNameAndCheckBox);
        taskDiv.append(taskDetails);

        taskList.append(taskDiv);
        // console.log(taskDueDate);
      });
  }

  const taskList = document.querySelector(".main-contents");
  function addTasks() {
    const taskBtn = document.querySelector(".task-btn");
    const taskAddBtn = document.querySelector(".task-dialog-add");
    const taskCancelBtn = document.querySelector(".task-dialog-cancel");
    const taskDialog = document.querySelector(".task-dialog");
    const taskNameField = document.querySelector("input[name=input-task]");
    const taskPriority = document.querySelector("select[name=priority]");
    const dueDate = document.querySelector("input[name=due-date]");

    taskBtn.addEventListener("click", () => {
      taskDialog.showModal();
    });

    taskAddBtn.addEventListener("click", () => {
      const taskName = taskNameField.value;
      const priority = taskPriority.value;
      const date = format(dueDate.value, "MM/dd/yyyy");
      let ind = 0;
      for (let node of projList.childNodes) {
        if (node.classList == "active-proj") {
          ind = node.id;
          break;
        }
      }
      todos.addNewTask(ind, taskName, date, priority);
      renderTasks();
      taskDialog.close();
    });

    taskCancelBtn.addEventListener("click", () => {
      taskDialog.close();
    });
  }

  function start() {
    addProject();
    addTasks();
    todoFunctionalities();
  }
  return {
    start,
  };
}

const ui = userInterface();
ui.start();
