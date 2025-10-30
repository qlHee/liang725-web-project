const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("item-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.querySelector(".empty-state");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");

// 数据初始化
let todos = [];
let currentFilter = "all";


addTaskBtn.addEventListener("click", () => {
    addTodo(taskInput.value);
});


taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodo(taskInput.value);
});

clearCompletedBtn.addEventListener("click", clearCompleted);



function addTodo(text) {
    if (text.trim() === "") return;
    const todo = {
        id: Date.now(),      // 生成唯一ID
        text: text,          // 任务文本内容
        completed: false     
    };
    todos.push(todo);        
    saveTodos();             
    renderTodos();           // 重新渲染列表
    taskInput.value = "";    
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    updateItemsCount();      // 更新底部计数
    checkEmptyState();       // 检查空状态显示
}

function updateItemsCount() {
    const uncompletedTodos = todos.filter((todo) => !todo.completed);
    itemsLeft.textContent = `${uncompletedTodos?.length} item${
        uncompletedTodos?.length !== 1 ? "s" : ""
    } left`;
}

function checkEmptyState() {
    // 检查当前视图（基于 currentFilter）是否有任务
    const filteredTodos = filterTodos(currentFilter);
    if (filteredTodos?.length === 0) emptyState.classList.remove("hidden");
    else emptyState.classList.add("hidden");
}


function renderTodos() {
    todosList.innerHTML = "";
    const filteredTodos = filterTodos(currentFilter); // 根据当前的filter进行过滤

    filteredTodos.forEach((todo) => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("todo-item");
        if (todo.completed) todoItem.classList.add("completed");

        const checkboxContainer = document.createElement("label");
        checkboxContainer.classList.add("checkbox-container");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("todo-checkbox");
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => toggleTodo(todo.id));

        const checkmark = document.createElement("span");
        checkmark.classList.add("checkmark");

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkmark);

        const todoText = document.createElement("span");
        todoText.classList.add("todo-item-text");
        todoText.textContent = todo.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

        todoItem.appendChild(checkboxContainer);
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteBtn);

        todosList.appendChild(todoItem);
    });
}

function filterTodos(filter) {
    switch (filter) {
        case "active":
            return todos.filter((todo) => !todo.completed);
        case "completed":
            return todos.filter((todo) => todo.completed);
        default:
            return todos;
    }
}

function toggleTodo(id) {
    todos = todos.map((todo) => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter((todo) => !todo.completed);
    saveTodos();
    renderTodos();
}

filters.forEach((filter) => {
    filter.addEventListener("click", () => {
        setActiveFilter(filter.getAttribute("data-filter"));
    });
});

function setActiveFilter(filter) {
    currentFilter = filter;

    filters.forEach((item) => {
        if (item.getAttribute("data-filter") === filter) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
    renderTodos();
    checkEmptyState(); // 切换过滤器后，检查空状态
}

function setDate() {
    const options = { weekday: "long", month: "short", day: "numeric" };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString("en-US", options);
}

function loadTodos() {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) todos = JSON.parse(storedTodos);
    renderTodos();
    checkEmptyState(); // 加载任务后，检查空状态
}


window.addEventListener("DOMContentLoaded", () => {
    loadTodos();
    updateItemsCount();
    setDate();
});