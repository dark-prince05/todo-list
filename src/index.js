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
      li.textContent = todos.getTodos()[ind].name;
      if (ind === currProjInd) li.classList.add("active-proj");
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
      projDialog.close();
    });

    projList.addEventListener("click", (e) => {
      projList.childNodes.forEach((node) => {
        if (node.classList) {
          node.classList.remove("active-proj");
        }
      });
      e.target.classList.add("active-proj");
    });
  }
  return {
    addProject,
  };
}

const ui = userInterface();
ui.addProject();
