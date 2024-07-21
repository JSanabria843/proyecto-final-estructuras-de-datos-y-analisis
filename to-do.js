class ListNode {
    constructor(task) {
        this.task = task;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    append(task) {
        const newNode = new ListNode(task);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    delete(taskId) {
        if (!this.head) return;

        if (this.head.task.id === taskId) {
            this.head = this.head.next;
            return;
        }

        let current = this.head;
        while (current.next && current.next.task.id !== taskId) {
            current = current.next;
        }

        if (current.next) {
            current.next = current.next.next;
        }
    }

    find(taskId) {
        let current = this.head;
        while (current) {
            if (current.task.id === taskId) return current.task;
            current = current.next;
        }
        return null;
    }

    forEach(callback) {
        let current = this.head;
        while (current) {
            callback(current.task);
            current = current.next;
        }
    }

    toArray() {
        const arr = [];
        this.forEach(task => arr.push(task));
        return arr;
    }

    clear() {
        this.head = null;
    }
}


const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-Box");

let editId;
let isEditedTask = false;

const todos = new LinkedList();
const storedTodos = JSON.parse(localStorage.getItem("todo-list"));
if (storedTodos) {
    storedTodos.forEach(task => todos.append(task));
}

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo (btn.id);
    });
});

function showTodo(filter) {
    let li = "";
    todos.forEach((todo, id) => {
        let isCompleted = todo.status === "completed" ? "checked" : "";
        if (filter === todo.status || filter === "all") {
            li += `<li class="task">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${todo.id}" ${isCompleted}>
                    <p class="${isCompleted}">${todo.name}</p>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${todo.id}, '${todo.name}')"><i class="uil uil-pen">Edit</i></li>
                        <li onclick="deleteTask(${todo.id})"><i class="uil uil-trash">Delete</i></li>
                    </ul>
                </div>
            </li>`;
        }
    });
    taskBox.innerHTML = li || `<span>No hay tareas aquí</span>`;
}
showTodo("all");

function showMenu(selectedTask) {
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName !== "I" || e.target !== selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId) {
    todos.delete(deleteId);
    localStorage.setItem("todo-list", JSON.stringify(todos.toArray()));
    showTodo(document.querySelector("span.active").id);
}

clearAll.addEventListener("click", () => {
    todos.clear();
    localStorage.setItem("todo-list", JSON.stringify([]));
    showTodo("all");
});

function updateStatus(selectedTask) {
    let taskName = selectedTask.nextElementSibling;
    const task = todos.find(parseInt(selectedTask.id));
    if (task) {
        if (selectedTask.checked) {
            taskName.classList.add("checked");
            task.status = "completed";
        } else {
            taskName.classList.remove("checked");
            task.status = "pending";
        }
        localStorage.setItem("todo-list", JSON.stringify(todos.toArray()));
        showTodo(document.querySelector("span.active").id);
    }
}

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key === "Enter" && userTask) {
        if (!isEditedTask) {
            const taskInfo = { id: Date.now(), name: userTask, status: "pending" };
            todos.append(taskInfo);
        } else {
            isEditedTask = false;
            const task = todos.find(editId);
            if (task) {
                task.name = userTask;
            }
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos.toArray()));
        showTodo(document.querySelector("span.active").id);
    }
});
