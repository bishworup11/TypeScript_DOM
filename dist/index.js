"use strict";
const addButton = document.getElementById('add-button');
const deleteButton = document.getElementById('delete-button');
const header = document.querySelector('.header');
function getDayText(day) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
}
function getMonthText(month) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month];
}
function getGreeting(hour) {
    if (hour < 12) {
        return "Good Morning. What's your plan today?";
    }
    else if (hour < 18) {
        return "Good Afternoon. What's your plan today?";
    }
    else {
        return "Good Evening. What's your plan today?";
    }
}
const day = getDayText(new Date().getDay());
const date = new Date().getDate();
const month = getMonthText(new Date().getMonth());
const year = new Date().getFullYear();
const welcomeText = getGreeting(new Date().getHours());
;
header.children[0].textContent = `${date} ${month} ${year}`;
header.children[1].textContent = welcomeText;
let todoList = localStorage.getItem('todoList') ? JSON.parse(localStorage.getItem('todoList')) : [];
if (todoList.length > 0) {
    buildTable(todoList);
}
addButton.addEventListener('click', () => {
    var _a;
    const inputText = (_a = document.querySelector('input')) === null || _a === void 0 ? void 0 : _a.value;
    document.querySelector('input').value = '';
    const todo = {
        id: Date.now(),
        text: inputText,
        done: false
    };
    todoList.push(todo);
    console.log(todoList);
    buildTable(todoList);
    localStorage.setItem('todoList', JSON.stringify(todoList));
});
function buildTable(todoList) {
    const table = document.querySelector('table');
    //clear table body
    table.children[1].innerHTML = '';
    todoList.forEach(todo => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.textContent = todo.text;
        const td2 = document.createElement('td');
        td2.innerHTML = `<button onclick="editFun(this)">Edit</button>
                      <button onclick="completeFun(this)">Complete</button>
                      <button onclick="deleteFun(this)">Delete</button>`;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.setAttribute('key', todo.id.toString());
        if (todo.done) {
            td1.style.textDecoration = 'line-through';
            td2.innerHTML = `<button onclick="editFun(this)">Edit</button>
                      <button onclick="completeFun(this)">Completed</button>
                      <button onclick="deleteFun(this)">Delete</button>`;
            tr.classList.add('completed');
        }
        table.children[1].appendChild(tr);
    });
}
function deleteFun(bt) {
    var _a, _b;
    const li = (_a = bt.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    const key = li.getAttribute('key');
    todoList = todoList.filter(todo => todo.id.toString() !== key);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    (_b = li.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(li);
}
function completeFun(bt) {
    var _a;
    const li = (_a = bt.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    const key = li.getAttribute('key');
    const todo = todoList.find(todo => todo.id.toString() === key);
    if (todo) {
        todo.done = !todo.done;
    }
    buildTable(todoList);
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
function editFun(bt) {
    var _a;
    const li = (_a = bt.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    if (bt.textContent === 'Edit') {
        bt.textContent = 'Save';
        li.children[0].innerHTML = `<input type="text" value="${li.children[0].textContent}">`;
    }
    else {
        bt.textContent = 'Edit';
        const key = li.getAttribute('key');
        const todo = todoList.find(todo => todo.id.toString() === key);
        if (todo) {
            todo.text = li.children[0].children[0].value;
        }
        buildTable(todoList);
        localStorage.setItem('todoList', JSON.stringify(todoList));
    }
    ;
}
function filterTodo(e) {
    const clickText = e.target.innerText;
    const par = e.target.parentElement;
    if (clickText === 'Show All') {
        buildTable(todoList);
        par.children[0].classList.add('active');
        par.children[1].classList.remove('active');
        par.children[2].classList.remove('active');
    }
    else if (clickText === 'Completed') {
        const completedList = todoList.filter(todo => todo.done);
        buildTable(completedList);
        par.children[0].classList.remove('active');
        par.children[1].classList.add('active');
        par.children[2].classList.remove('active');
    }
    else {
        const pendingList = todoList.filter(todo => !todo.done);
        buildTable(pendingList);
        par.children[0].classList.remove('active');
        par.children[1].classList.remove('active');
        par.children[2].classList.add('active');
    }
}
