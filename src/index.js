import "./style.css";
import deleteIcon from "../svg/delete.svg";
import editIcon from "../svg/edit.svg";
import { todo } from "./todo.js";
import { format } from "date-fns";

function todoList() {
  const storedTodos = JSON.parse(localStorage.getItem("todolist")) || [];

  const todos = storedTodos.map((project) => {
    const newTodo = todo();
    project.tasks.forEach((task) => {
      newTodo.addTodo(task.title, task.dueDate, task.priority, task.checked);
    });
    return {
      id: project.id,
      name: project.name,
      todoName: newTodo,
    };
  });

  function createNewProject(id, name) {
    const newTodo = todo();
    todos.push({ id, name, todoName: newTodo });
    saveToLocalStorage();
  }

  function removeProject(id) {
    todos.splice(id, 1);
    todos.map((item, ind) => {
      item.id = ind;
    });
    saveToLocalStorage();
  }

  function addNewTask(ind, title, dueDate, priority) {
    todos[ind].todoName.addTodo(title, dueDate, priority);
    saveToLocalStorage();
  }

  function removeTask(todoInd, taskInd) {
    todos[todoInd].todoName.removeTodo(taskInd);
    saveToLocalStorage();
  }

  function editTask(todoInd, taskInd, title, dueDate, priority) {
    todos[todoInd].todoName.editTodo(taskInd, title, dueDate, priority);
    saveToLocalStorage();
  }

  function saveToLocalStorage() {
    const storedTodos = todos.map((project) => ({
      id: project.id,
      name: project.name,
      tasks: project.todoName.getTodos(),
    }));
    localStorage.setItem("todolist", JSON.stringify(storedTodos));
  }

  return {
    addNewTask,
    removeTask,
    editTask,
    createNewProject,
    removeProject,
    getTodos: () => todos,
    saveToLocalStorage,
  };
}

function userInterface() {
  const projBtn = document.querySelector(".proj-add-btn");
  const projDialog = document.querySelector(".proj-dialog");
  const projAddBtn = document.querySelector(".proj-dialog-add");
  const projCancelBtn = document.querySelector(".proj-dialog-cancel");
  const projNameField = document.querySelector("input[name=proj-name-inp]");
  const projList = document.querySelector(".lists");
  const projTitle = document.querySelector(".project-title");

  const taskList = document.querySelector(".main-contents");
  const taskBtn = document.querySelector(".task-btn");
  const taskAddBtn = document.querySelector(".task-dialog-add");
  const taskEditBtn = document.querySelector(".task-dialog-edit");
  const taskCancelBtn = document.querySelector(".task-dialog-cancel");
  const taskDialog = document.querySelector(".task-dialog");
  const taskNameField = document.querySelector("input[name=input-task]");
  const taskPriority = document.querySelector("select[name=priority]");
  const taskDueDate = document.querySelector("input[name=due-date]");

  const todos = todoList();
  if (todos.getTodos().length == 0) {
    todos.createNewProject(0, "Daily Routine");
  }

  window.addEventListener("load", () => {
    renderProjects();
    renderTasks();
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
    taskList.addEventListener("click", (e) => {
      let projInd = 0;
      const todoInd = e.target.parentElement.parentElement.id;
      const checkBox = e.target;
      if (e.target.tagName.toLowerCase() == "input") {
        for (let child of projList.childNodes) {
          if (child.classList.contains("active-proj")) {
            projInd = child.id;
            break;
          }
        }
        const taskDiv = checkBox.parentElement.parentElement;
        if (checkBox.checked) {
          todos.getTodos()[projInd].todoName.getTodos()[todoInd].checked = true;
          taskDiv.classList.add("completed");
          todos.saveToLocalStorage();
        } else {
          todos.getTodos()[projInd].todoName.getTodos()[todoInd].checked =
            false;
          taskDiv.classList.remove("completed");
          todos.saveToLocalStorage();
        }
      }
      if (e.target.tagName.toLowerCase() == "img") {
        if (e.target.classList == "edit-btn") {
          for (let child of projList.childNodes) {
            if (child.classList.contains("active-proj")) {
              projInd = child.id;
              break;
            }
          }
          taskAddBtn.classList.add("hidden");
          taskEditBtn.classList.remove("hidden");
          if (
            !e.target.parentElement.parentElement.classList.contains(
              "completed",
            )
          ) {
            taskDialog.showModal();
          }
          taskEditBtn.addEventListener("click", editTask);
        }

        function editTask() {
          const taskName = taskNameField.value;
          const priority = taskPriority.value;
          let date = "";
          if (taskDueDate.value) {
            date = format(taskDueDate.value, "MM/dd/yyyy");
          }
          todos.editTask(projInd, todoInd, taskName, date, priority);
          taskNameField.value = "";
          taskDueDate.value = "";
          taskPriority.value = "low";
          taskDialog.close();
          taskEditBtn.removeEventListener("click", editTask);
          renderTasks();
        }
        if (e.target.classList.contains("del-btn")) {
          for (let child of projList.childNodes) {
            if (child.classList.contains("active-proj")) {
              projInd = child.id;
              break;
            }
          }
          todos.removeTask(projInd, todoInd);
        }
        renderTasks();
      }
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
        todos
          .getTodos()
          [ind].todoName.getTodos()
          .forEach((element, ind) => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("tasks", element.priority);
            taskDiv.id = ind;
            const taskNameAndCheckBox = document.createElement("div");
            const taskCheckBox = document.createElement("input");
            taskCheckBox.type = "checkbox";
            taskCheckBox.name = "task-name";

            if (element.checked == true) {
              taskDiv.classList.add("completed");
              taskCheckBox.checked = true;
            }

            const taskCheckBoxLabel = document.createElement("label");
            taskCheckBoxLabel.htmlFor = "task-name";
            taskCheckBoxLabel.textContent = element.title;
            taskNameAndCheckBox.append(taskCheckBox);
            taskNameAndCheckBox.append(taskCheckBoxLabel);

            const taskDetails = document.createElement("div");
            const taskDueDate = document.createElement("label");
            if (element.dueDate) {
              taskDueDate.textContent = element.dueDate;
              taskDetails.append(taskDueDate);
            }
            const taskEditBtn = document.createElement("img");
            taskEditBtn.src = editIcon;
            taskEditBtn.classList.add("edit-btn");
            const taskDeleteBtn = document.createElement("img");
            taskDeleteBtn.src = deleteIcon;
            taskDeleteBtn.classList.add("del-btn");
            taskDetails.append(taskEditBtn);
            taskDetails.append(taskDeleteBtn);

            taskDiv.append(taskNameAndCheckBox);
            taskDiv.append(taskDetails);

            taskList.append(taskDiv);
          });
        break;
      }
      projTitle.textContent = "";
    }
    todos.saveToLocalStorage();
  }

  function addTasks() {
    taskBtn.addEventListener("click", () => {
      taskAddBtn.classList.remove("hidden");
      taskEditBtn.classList.add("hidden");
      taskDialog.showModal();
    });

    taskAddBtn.addEventListener("click", () => {
      const taskName = taskNameField.value;
      const priority = taskPriority.value;
      let date = "";
      if (taskDueDate.value) {
        date = format(taskDueDate.value, "MM/dd/yyyy");
      }
      let ind = 0;
      for (let node of projList.childNodes) {
        if (node.classList == "active-proj") {
          ind = node.id;
          break;
        }
      }
      todos.addNewTask(ind, taskName, date, priority);
      taskNameField.value = "";
      taskDueDate.value = "";
      taskPriority.value = "low";
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

userInterface().start();
