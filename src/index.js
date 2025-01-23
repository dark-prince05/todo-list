import "./style.css";
import { todo } from "./todo.js";

function todoList() {
  const todos = [];

  function createNewProject(id, name) {
    todos.push({ id, name, todoName: [] });
  }
  function addTodoList(ind, title, dueDate, priority) {
    const newTodo = todo();
    newTodo.addTodo(title, dueDate, priority);
    todos[ind].todoName.push(newTodo.getTodos());
  }
  return {
    createNewProject,
    addTodoList,
    getTodos: () => todos,
  };
}
const t = todoList();
t.createNewProject(0);
t.createNewProject(1);
t.addTodoList(0, "dddd", "tttt", "dddd");
t.addTodoList(0, "dddd", "tttt", "dddd");
t.addTodoList(1, "dddd", "tttt", "dddd");
console.log(t.getTodos()[0]);

function userInterface() {
  const projBtn = document.querySelector(".proj-add-btn");
  const projDialog = document.querySelector(".proj-dialog");
  const projAddBtn = document.querySelector(".proj-dialog-add");
  const projCancelBtn = document.querySelector(".proj-dialog-cancel");
  const projNameField = document.querySelector("input[name=proj-name-inp]");
  const projList = document.querySelector(".lists");

  const todos = todoList();
  todos.createNewProject(0, "Daily Routine");

  window.addEventListener("load", () => {
    renderProjects();
    projList.firstChild.classList.add("active-proj");
  });

  function clearProjects() {
    projList.textContent = "";
  }

  function renderProjects() {
    todos.getTodos().forEach((_, ind) => {
      const li = document.createElement("li");
      li.textContent = todos.getTodos()[ind].name;
      li.id = todos.getTodos()[ind].id;
      projList.append(li);
    });
  }

  function addProject() {
    projBtn.addEventListener("click", () => {
      projDialog.showModal();
    });

    projCancelBtn.addEventListener("click", () => {
      projDialog.close();
    });

    projAddBtn.addEventListener("click", () => {
      clearProjects();
      const index = todos.getTodos().length;
      todos.createNewProject(index, projNameField.value);
      renderProjects();
      projDialog.close();
    });
  }
  return {
    addProject,
  };
}

const ui = userInterface();
ui.addProject();
