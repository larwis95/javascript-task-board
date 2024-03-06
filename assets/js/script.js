// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let taskOrder = JSON.parse(localStorage.getItem("taskOrder"));
const modalForm = $('#form-modal');
const todoUl = $('#todo-list');
const inProgressUl = $('#inprogress-list');
const doneUl = $('#done-list');
const taskName = $('#taskName');
const taskDate = $('#taskDate');
const taskDesc = $('#taskDescription');
const colorDate = 5;
let savedCards = [];
let savedLists = [];

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = dayjs().unix() + Math.random();
    return id;
};

// Todo: create a function to create a task card
function createTaskCard(task) {
    todoUl.append(`<li id="${task.id}"><div class="card" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">${task.name}</h5>
      <h6 class="card-subtitle">Due Date: ${dayjs(`${task.date}`).format('MMM D, YYYY')}</h6>
      <p class="card-text">${task.desc}</p>
      <button>Delete</button>
     </div>
  </div></li>`);
  handleDrag();
  taskName.val('');
  taskDate.val('');
  taskDesc.val('');
};

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    let allList = $('ul');
    for (let i = 0; i < savedLists.length; i++) {
        allList[i].innerHTML = savedLists[i];
    };
    let allLi = $(allList.children());
        for (let i = 0; i < allLi.length; i++) {
            let id = $(allLi[i]).attr('id');
            if (id == savedCards[i].id) {
                let today = dayjs();
                let dueDate = dayjs(savedCards[i].date)
                console.log(`due date days left: ${dueDate.diff(today, 'days')}`)
                if (dueDate.diff(today, 'days') < colorDate && dueDate.diff(today, 'days') > 0 && $(allLi[i]).parent().attr('id') !== 'done-list') {
                    $(allLi[i].children[0]).attr('class', 'card text-dark bg-warning mb-3');
                    $(allLi[i].children[0].children[0].children[3]).attr('class', 'btn btn-warning btn-outline-dark');
                }
                else if (dueDate.diff(today, 'days') <= 0 && $(allLi[i]).parent().attr('id') !== 'done-list') {
                    $(allLi[i].children[0]).attr('class', 'card text-white bg-danger mb-3');
                    $(allLi[i].children[0].children[0].children[3]).attr('class', 'btn btn-danger btn-outline-light');
                }
                else if ((dueDate.diff(today, 'days') >= colorDate || $(allLi[i]).parent().attr('id') === 'done-list')) {
                    $(allLi[i].children[0]).attr('class', 'card text-white bg-success mb-3');
                    $(allLi[i].children[0].children[0].children[3]).attr('class', 'btn btn-success btn-outline-light');
                };
            };
        };
};

// Todo: create a function to handle adding a new task
function handleAddTask() {
    const formModal = $('#formModal');
     task = {
        name: taskName.val(),
        date: taskDate.val(),
        desc: taskDesc.val(),
        id: generateTaskId(),
    };
    savedCards.push(task);
    localStorage.setItem('tasks', JSON.stringify(savedCards));
    formModal.modal('toggle');
    createTaskCard(task);
};

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const deleteBtn = $(event.target);
    const li = deleteBtn.closest('li');
    const liId = li.attr('id');
    for (let i = 0; i < savedCards.length; i++) {
        if (savedCards[i].id == liId) {
            savedCards.splice(i, 1);
            localStorage.setItem("tasks", JSON.stringify(savedCards));
            li.remove();
        };
    };
    handleDrag();
    
};

function handleDrag(event, ui) {
    let allList = $('ul')
    savedLists = [];
    for (let i = 0; i < allList.length; i++) {
        savedLists.push(allList[i].innerHTML);
    };
    localStorage.setItem("taskOrder", JSON.stringify(savedLists));
    renderTaskList();
};

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(() => {
    const submitForm = $('#card-form');
    const deleteTaskBtn = $('#lists-container');
    const lists = $('ul.connected-list');
    lists.sortable({
    connectWith: ".connected-list",
    placeholder: "ui-state-highlight",
    stop: (event, ui) => {
        handleDrag(event, ui);
    }}).disableSelection();
    if (taskOrder !== null) {
        savedLists = taskOrder;
    };
    if (taskList !== null) {
        savedCards = taskList;
    };
    renderTaskList();
    submitForm.on('submit', (event) => {
        event.preventDefault();
        handleAddTask();
    });
    deleteTaskBtn.on('click', (event) => {
        event.stopPropagation();
        handleDeleteTask(event);
    });

});
