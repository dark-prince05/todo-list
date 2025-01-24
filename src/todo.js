function createTodo(title, dueDate, priority) {
  return {
    title,
    dueDate,
    priority,
  };
}

export function todo() {
  const todos = [];

  function addTodo(title, dueDate, priority) {
    todos.push(createTodo(title, dueDate, priority));
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
