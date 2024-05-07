function createElement(tag, attributes, children, callbacks = []) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  callbacks.forEach((callback) => {
    element.addEventListener(callback.type, callback.listener);
  });

  return element;
}

class Component {
  constructor() {}

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    this._domNode.replaceWith(this.getDomNode());
  }
}

class TodoList extends Component {
  constructor(state) {
    super();
    this.state = state;
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      new AddTodo(this.onAddTask.bind(this)).getDomNode(),
      createElement(
        "ul",
        { id: "todos" },
        this.state.todos.map((todo) =>
          new Task(todo, this.onTaskDeleteFactory(todo)).getDomNode()
        )
      ),
    ]);
  }

  onAddTask(text) {
    this.state.todos.push({ text, done: false });
    this.update();
  }

  onTaskDeleteFactory(task) {
    return () => {
      const taskIndex = this.state.todos.indexOf(task);
      this.state.todos.splice(taskIndex, 1);
      this.update();
    };
  }
}

class Task extends Component {
  constructor(todo, onDeleteTask) {
    super();
    this.todo = todo;
    this.count = 0;
    this.onDeleteTask = onDeleteTask;
  }
  render() {
    return createElement("li", { class: this.todo.done ? "completed" : "" }, [
      createElement(
        "input",
        { type: "checkbox", ...(this.todo.done && { checked: true }) },
        null,
        [
          {
            type: "click",
            listener: () => {
              this.todo.done = !this.todo.done;
              this.update();
            },
          },
        ]
      ),
      createElement("label", {}, this.todo.text),
      createElement("button", {class: this.count === 1 ? 'needTodel' : ''}, "🗑️", [
        {
          type: "click",
          listener: () => {
            this.count++;
            if (this.count === 2)
              this.onDeleteTask();
            this.update();
          },
        },
      ]),
    ]);
  }
}

class AddTodo extends Component {
  constructor(onAddTask) {
    super();
    this.onAddTask = onAddTask;
    this.text = "";
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement(
        "input",
        {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
        },
        null,
        [{ type: "input", listener: this.onAddInputChange.bind(this) }]
      ),
      createElement("button", { id: "add-btn" }, "+", [
        { type: "click", listener: () => this.onAddTask(this.text) },
      ]),
    ]);
  }

  onAddInputChange(event) {
    this.text = event.target.value;
  }
}

var doneTasks = [];

const state = {
  text: "",
  todos: [
    { text: "Сделать домашку", done: false },
    { text: "Сделать практику", done: false },
    { text: "Пойти домой", done: false },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList(state).getDomNode());
});
