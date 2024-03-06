// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
const modalForm = $('#form-modal');
const todoUl = $('#todo-list');
const inProgressUl = $('#inprogress-list');
const doneUl = $('#done-list');
const connect = {connectWith: ".connected-list"};
const taskName = $('#taskName');
const taskDate = $('#taskDate');
const taskDesc = $('#taskDescription');
let savedCards = [];

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
      <h6 class="card-subtitle mb-2 text-muted">Due Date: ${task.date}</h6>
      <p class="card-text">${task.desc}</p>
      <button>Delete</button>
     </div>
  </div></li>`);
  taskName.val('');
  taskDate.val('');
  taskDesc.val('');
};

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

};

// Todo: create a function to handle adding a new task
function handleAddTask() {
    const formModal = $('#formModal');
     task = {
        name: taskName.val(),
        date: dayjs(`${taskDate.val()}`).format('MMM D, YYYY'),
        desc: taskDesc.val(),
        id: generateTaskId(),
        list: '',
        pos: '',
    };
    savedCards.push(task);
    localStorage.setItem('tasks', JSON.stringify(savedCards));
    formModal.modal('toggle');
    createTaskCard(task);
};

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const deleteBtn = $(event.target);
    console.log(deleteBtn);
    const li = deleteBtn.closest('li');
    const liId = li.attr('id');
    console.log(liId);
    for (let i = 0; i < savedCards.length; i++) {
        console.log(savedCards[i].id)
        if (savedCards[i].id == liId) {
            console.log(`removed ${savedCards[i]}`);
            savedCards.splice(i, 1);
            console.log(savedCards);
            localStorage.setItem("tasks", JSON.stringify(savedCards));
            console.log(`deleted ${li}`);
            li.remove();
        };
    };
    
};

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

};

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(() => {
    const submitForm = $('#card-form');
    const deleteTaskBtn = $('#lists-container');
    const lists = $('ul.connected-list');
    lists.sortable(connect)
    submitForm.on('submit', (event) => {
        console.log('submitted');
        event.preventDefault();
        handleAddTask();
    });
    deleteTaskBtn.on('click', (event) => {
        event.stopPropagation();
        handleDeleteTask(event);
    });

});
