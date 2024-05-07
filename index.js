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
      createElement("div", { class: "add-todo" }, [
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
          { type: "click", listener: this.onAddTask.bind(this) },
        ]),
      ]),
      createElement(
        "ul",
        { id: "todos" },
        this.state.todos.map((todo) =>
          createElement("li", { className: todo.done ? "completed" : "" }, [
            createElement(
              "input",
              { type: "checkbox", checked: todo.done },
              {
                type: "click",
                listener: () => {
                  todo.done = true;
                  
                },
              }
            ),
            createElement("label", {}, todo.text),
            createElement("button", {}, "🗑️", [
              { type: "click", listener: this.onTaskDeleteFactory(x)},
            ]),
          ])
        )
      ),
    ]);
  }
  
  onAddTask(done) {
    this.state.todos.push({ text: this.state.text, done: done });
    this.state.text = ''; 
    this.update();
  }
  
  onTaskChecked(event){
    ind
    this.state.done = true;
    this.update();
  }

  onAddInputChange(event) {
    this.state.text = event.target.value;
  }

  onTaskDeleteFactory(task) {
    return () => {
      const taskIndex = this.state.todos.indexOf(task);
      this.state.todos.splice(taskIndex, 1);
      this.update();
    };
  }
}

var doneTasks =[]

const state = {
  text: '',
  todos: [
    { text: "Сделать домашку", done: false },
    { text: "Сделать практику", done: false },
    { text: "Пойти домой", done: false },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList(state).getDomNode());
});
