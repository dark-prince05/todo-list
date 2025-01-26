function createTodo(title, dueDate, priority, checked = false) {
  return {
    title,
    dueDate,
    priority,
    checked,
  };
}

export function todo() {
  const todos = [];

  function addTodo(title, dueDate, priority, checked) {
    todos.push(createTodo(title, dueDate, priority, checked));
  }

  function editTodo(ind, title, dueDate, priority) {
    if (title) todos[ind].title = title;
    if (dueDate) todos[ind].dueDate = dueDate;
    if (priority) todos[ind].priority = priority;
  }

  function removeTodo(ind) {
    todos.splice(ind, 1);
  }

  return {
    getTodos: () => todos,
    getLength: () => todos.length,
    addTodo,
    editTodo,
    removeTodo,
  };
}
