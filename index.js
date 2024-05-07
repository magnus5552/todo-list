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
    this._domNode.replaceWith(this.getDomNode())
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
        this.state.todos.map((x) =>
          createElement("li", {}, [
            createElement("input", { type: "checkbox" }),
            createElement("label", {}, x),
            createElement("button", {}, "🗑️", [{ type: 'click', listener: () => {
              const taskIndex = this.state.todos.indexOf(x);
              this.state.todos.splice(taskIndex, 1);
              this.update();
            }}]),
          ])
        )
      ),
    ]);
  }

  onAddTask() {
    this.state.todos.push(this.state.text);
    this.state.text = '';
    this.update();
  }

  onAddInputChange(event) {
    this.state.text = event.target.value;
  }
}

const state = {
  text: "",
  todos: ["Сделать домашку", "Сделать практику", "Пойти домой"],
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList(state).getDomNode());
});
