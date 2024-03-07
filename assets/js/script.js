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
const breakpointDate = 5;
const classes = {
    greenCard: "card text-white bg-success mb-3",
    greenBtn: 'btn btn-success btn-outline-light',
    yellowCard: 'card text-dark bg-warning mb-3',
    yellowBtn: 'btn btn-warning btn-outline-dark',
    redCard: 'card text-white bg-danger mb-3',
    redBtn: 'btn btn-danger btn-outline-light'
};
let savedCards = [];
let orderList = [];

class card {
    constructor(colorCheck) {
        this.colorCheck = colorCheck;
    }

    checkColor() {
        if (this.colorCheck === 'green') {
            return classes.greenCard;
        }
        else if (this.colorCheck === 'yellow') {
            return classes.yellowCard;
        }
        else {
            return classes.redCard;
        }
    }
};
class button extends card {
    constructor(colorCheck) {
    super(colorCheck)
    }
    
    checkColor() {
        if (this.colorCheck === 'green') {
            return classes.greenBtn;
        }
        else if (this.colorCheck === 'yellow') {
            return classes.yellowBtn;
        }
        else {
            return classes.redBtn;
        }
    }
};
// generate taskids
function generateTaskId() {
    let id = dayjs().unix() + Math.random();
    return id;
};

function checkDate(date) {
    const today = dayjs();
    const taskDate = dayjs(date);
    const daysLeft = taskDate.diff(today, 'days');
    console.log(daysLeft);
    if (daysLeft > breakpointDate) {
        return 'green';
    }
    else if (daysLeft <= breakpointDate && daysLeft >= 0) {
        return 'yellow';
    }
    else {
        return 'red'
    };
};

// creates the taskcards
function createTaskCard(task, list) {
    const cardColor = new card(task.color);
    const btnColor = new button(task.color);
    list.append(`<li id="${task.id}"><div class="${cardColor.checkColor()}" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">${task.name}</h5>
      <h6 class="card-subtitle">${dayjs(`${task.date}`).format('MMM D, YYYY')}</h6>
      <p class="card-text">${task.desc}</p>
      <button class="${btnColor.checkColor()}"}>Delete</button>
     </div>
  </div></li>`);
  updateTaskOrder();
};

// renders our lists
function renderTaskList() {
    const allList = $('ul');
    allList.empty();
    debugger;
    const todoIds = orderList[0].map(Number);
    const inprogIds = orderList[1].map(Number);
    const completeIds = orderList[2].map(Number);
    console.log(savedCards.length);
    for (let i = 0; i < savedCards.length; i++) {
        if (todoIds.includes(savedCards[i].id) === true) {
        createTaskCard(savedCards[i], todoUl);
        }
        if (inprogIds.includes(savedCards[i].id) === true) {
        createTaskCard(savedCards[i], inProgressUl);
        }
        if (completeIds.includes(savedCards[i].id) === true) {
        savedCards[i].color = 'green'
        createTaskCard(savedCards[i], doneUl);
        }
    }
    updateTaskOrder();
};



// Todo: create a function to handle adding a new task
function handleAddTask() {
    const formModal = $('#formModal');
     task = {
        name: taskName.val(),
        date: taskDate.val(),
        desc: taskDesc.val(),
        id: generateTaskId(),
        color: ''
    };
    task.color = checkDate(task.date);
    savedCards.push(task);
    localStorage.setItem('tasks', JSON.stringify(savedCards));
    formModal.modal('toggle');
    createTaskCard(task, todoUl);
};

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const deleteBtn = $(event.target);
    const li = deleteBtn.closest('li');
    const liId = li.attr('id');
    for (let i = 0; i < savedCards.length; i++) {
        if (savedCards[i].id == liId) {
            savedCards.splice(i, 1);
            li.remove();
        };
    };
    localStorage.setItem("tasks", JSON.stringify(savedCards));
    updateTaskOrder();
};

function updateTaskOrder() {
    orderList = [];
    orderList = [todoUl.sortable('toArray', {attribute: 'id'}), inProgressUl.sortable('toArray', {attribute: 'id'}), doneUl.sortable('toArray', {attribute: 'id'})]
    localStorage.setItem('taskOrder', JSON.stringify(orderList));
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(() => {
    const submitForm = $('#card-form');
    const deleteTaskBtn = $('#lists-container');
    const lists = $('ul.connected-list');
    lists.sortable(
    {
    connectWith: ".connected-list",
    placeholder: "ui-state-highlight",
    stop: (event, ui) => {
        orderList = [todoUl.sortable('toArray', {attribute: 'id'}), inProgressUl.sortable('toArray', {attribute: 'id'}), doneUl.sortable('toArray', {attribute: 'id'})]
        let li = $(ui.item);
        let ul = li.closest('ul');
        let btn = li.find('button');
        let cardDiv = li.children()
        console.log(cardDiv);
        localStorage.setItem('taskOrder', JSON.stringify(orderList));
        if (ul.attr('id') === 'done-list') {
            cardDiv.attr('class', classes.greenCard);
            btn.attr('class', classes.greenBtn);
        }
        else if (ul.attr('id') !== 'done-list') {
            let dateText = li.find('h6').text;
            let formatedDate = dayjs(dateText).format('YYYY MM DD')
            let colorCheck = checkDate(formatedDate);
            const cardColor = new card(colorCheck)
            const btnColor = new button(colorCheck);
            cardDiv.attr('class', cardColor.checkColor());
            btn.attr('class', btnColor.checkColor());
        }
      }
    }
    ).disableSelection();
    if (taskOrder !== null) {
        orderList = taskOrder;
    };
    if (taskList !== null) {
        savedCards = taskList;
    };
    submitForm.on('submit', (event) => {
        event.preventDefault();
        handleAddTask();
    });
    deleteTaskBtn.on('click', (event) => {
        event.stopPropagation();
        handleDeleteTask(event);
    });
    renderTaskList();
});
