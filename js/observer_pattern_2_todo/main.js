// 주체 (Subject): todoModel
// 옵저버 (Observer): todoList, todoCount

import { Subject, Observer } from "./core.js";

class TodoModel extends Subject {
    constructor(initialState) {
        super(initialState);
    }

    addTodo(todoValue) {
        if (!todoValue.trim()) return;
        const newTodo = {
            id: this.state.length + 1,
            value: todoValue,
        };
        const newTodoList = [...this.state, newTodo];
        this.setState(newTodoList);
    }
}

class TodoList extends Observer {
    update(newState) {
        const $ul = document.querySelector(".todo-list");
        $ul.innerHTML = `${newState.map((todo) => `<li>${todo.value}</li>`).join("")}`;
    }
}

class TodoCount extends Observer {
    update(newState) {
        const $count = document.querySelector(".count");
        $count.innerHTML = `(${newState.length})`;
    }
}

const todoModel = new TodoModel([
    { id: 1, value: "밥 먹기" },
    { id: 2, value: "샤워 하기" },
]);
const todoList = new TodoList();
const todoCount = new TodoCount();

todoList.update(todoModel.getState());
todoCount.update(todoModel.getState());

const getElement = (selector) => {
    return document.querySelector(selector);
};
const appendTodo = () => {
    const $input = getElement("#new-todo");
    const inputValue = $input.value;
    todoModel.addTodo(inputValue);
    $input.value = "";
};
const addClickHandler = (element) => {
    element.addEventListener("click", appendTodo);
};

todoModel.initialize();

addClickHandler(getElement("#add-todo"));
