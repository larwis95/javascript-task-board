// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let taskOrder = JSON.parse(localStorage.getItem("taskOrder"));
const modalForm = $('#form-modal'); //selects our form inside our modal
const todoUl = $('#todo-list'); //selects the todo list
const inProgressUl = $('#inprogress-list'); //selects the in progress list
const doneUl = $('#done-list'); //selects the done list
const taskName = $('#taskName'); //selects the taskname input box
const taskDate = $('#taskDate'); //selects the taskdate input
const taskDesc = $('#taskDescription'); //selects the decription input
const breakpointDate = 5; //colors breakpoint if <5 days remain until due date turn to yellow
const classes = { //object to hold our classes for changing the card and btn colors
    greenCard: "card text-white bg-success mb-3",
    greenBtn: 'btn btn-success btn-outline-light',
    yellowCard: 'card text-dark bg-warning mb-3',
    yellowBtn: 'btn btn-warning btn-outline-dark',
    redCard: 'card text-white bg-danger mb-3',
    redBtn: 'btn btn-danger btn-outline-light'
};
let savedCards = []; //array that holds our saved card values
let orderList = [[], [], []]; //array that saves our list order

//class that handles the card colors,
class card {
    constructor(colorCheck) {
        this.colorCheck = colorCheck;
    }

    checkColor() { //method to check the card color value and return the class it needs
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

//class that handles the button colors, inherits constructors from card class
class button extends card {
    constructor(colorCheck) {
    super(colorCheck);
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
    let id = dayjs().unix() + Math.random(); //generates a unique id by taking unix time and adding a random number > 0 but < 1
    return id;
};

//checks the date and sets the task color based on time remaining
function checkDate(date) {
    const today = dayjs(); //current date
    const taskDate = dayjs(date); //the date from our task
    const daysLeft = taskDate.diff(today, 'days'); //the difference in days between our due date and today
    if (daysLeft > breakpointDate) {  //if statements to return task colors, if its > breakpointDate then return green
        return 'green';
    }
    else if (daysLeft <= breakpointDate && daysLeft >= 0) { //if its between 0 and breakpointDate return yellow
        return 'yellow';
    }
    else { //if below 0 return red
        return 'red';
    };
};

// creates the taskcards
function createTaskCard(task, list) {
    const cardColor = new card(task.color); //creating a new object for returning our class needed for the card
    const btnColor = new button(task.color); //creating a new object for returning our class needed for the button
    list.append(`<li id="${task.id}"><div class="${cardColor.checkColor()}" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">${task.name}</h5>
      <h6 class="card-subtitle">${dayjs(`${task.date}`).format('MMM D, YYYY')}</h6>
      <p class="card-text">${task.desc}</p>
      <button class="${btnColor.checkColor()}"}>Delete</button>
     </div>
  </div></li>`); //appends a list item based on the task values and what our objects returned
  updateTaskOrder(); //updates the order of the tasks in our list
};

// renders our lists
function renderTaskList() {
    const allList = $('ul'); //selects all the lists
    allList.empty(); //emptys the lists because we are going to be generating a new list
    const todoIds = orderList[0].map(Number);
    const inprogIds = orderList[1].map(Number);  //these 3 lines convert our orderlist sub array values to numbers so we can compare them with our task ids
    const completeIds = orderList[2].map(Number);
    for (let i = 0; i < savedCards.length; i++) {  //loop that checks every task and compares it to the task id[i] to determine which list it goes in.
        if (todoIds.includes(savedCards[i].id) === true) {
        createTaskCard(savedCards[i], todoUl);
        }
        if (inprogIds.includes(savedCards[i].id) === true) {
        createTaskCard(savedCards[i], inProgressUl);
        }
        if (completeIds.includes(savedCards[i].id) === true) {
        savedCards[i].color = 'green' //if its in the done list color should always be green
        createTaskCard(savedCards[i], doneUl);
        }
    }
    updateTaskOrder(); //updates the order of our cards
};

// adds task to task array, then renders the task to the page
function handleAddTask() {
    const formModal = $('#formModal'); //selects our modal
     task = { //object created to store our values from our form
        name: taskName.val(),
        date: taskDate.val(),
        desc: taskDesc.val(),
        id: generateTaskId(),
        color: ''
    };
    task.color = checkDate(task.date); //checks the due date to set the color value in our task object
    savedCards.push(task); //pushes the task to our savedCards array
    localStorage.setItem('tasks', JSON.stringify(savedCards)); //updates local storage with our tasks
    formModal.modal('toggle'); //closes our modal
    createTaskCard(task, todoUl); //creates our task card
};

// deletes task when button is pressed, removes it from the taskarray and local storage
function handleDeleteTask(event) {
    const deleteBtn = $(event.target); //sets the deleteBtn const to the btn we clicked on from our event listener
    const li = deleteBtn.closest('li'); //selects the closest li to our button
    const liId = li.attr('id'); //get the id of our li
    for (let i = 0; i < savedCards.length; i++) { //runs a loop that checks our id against our savedcards id, if its in the array it deletes that entry, then deletes the card
        if (savedCards[i].id == liId) {
            savedCards.splice(i, 1);
            li.remove();
        };
    };
    localStorage.setItem("tasks", JSON.stringify(savedCards)); //updates local storage
    updateTaskOrder(); //updates task positions
};

function updateTaskOrder() {
    orderList = []; //clears our saved order
    orderList = [todoUl.sortable('toArray', {attribute: 'id'}), inProgressUl.sortable('toArray', {attribute: 'id'}), doneUl.sortable('toArray', {attribute: 'id'})]; //updates the order in our savedOrder array
    localStorage.setItem('taskOrder', JSON.stringify(orderList)); //updates local storage with our new order
    
};

// makes lists sortable on load, renders task cards to lists, updates list positions, updates card colors when moved, adds form submit listener, and delete button listener
$(document).ready(() => { 
    const submitForm = $('#card-form'); //selects our form in the modal
    const deleteTaskBtn = $('#lists-container'); //selects our container for our lists
    const lists = $('ul.connected-list'); //selects all our UL
    lists.sortable( //makes lists sortable
    {
    connectWith: ".connected-list", //connects the lists together to be sortable with class selector
    placeholder: "ui-state-highlight", //adds a place holder for when we hover over a spot to drop
    stop: (event, ui) => { //runs this function everytime we sort
        orderList = [todoUl.sortable('toArray', {attribute: 'id'}), inProgressUl.sortable('toArray', {attribute: 'id'}), doneUl.sortable('toArray', {attribute: 'id'})] //updates our order list
        let li = $(ui.item); //selecting the li by using the ui action target we select a bunch of relevent elements below as well
        let ul = li.closest('ul');
        let btn = li.find('button');
        let cardDiv = li.children()
        localStorage.setItem('taskOrder', JSON.stringify(orderList)); //updates local storage with order
        if (ul.attr('id') === 'done-list') { //if we drop in done list set to green
            cardDiv.attr('class', classes.greenCard);
            btn.attr('class', classes.greenBtn);
        }
        else if (ul.attr('id') !== 'done-list') { //if not set back to correct color it should be
            let dateText = li.find('h6').text;
            let formatedDate = dayjs(dateText).format('YYYY MM DD');
            let colorCheck = checkDate(formatedDate);
            const cardColor = new card(colorCheck);
            const btnColor = new button(colorCheck);
            cardDiv.attr('class', cardColor.checkColor());
            btn.attr('class', btnColor.checkColor());
        }
      }
    }
    ).disableSelection(); //disables text selection on our list
    if (taskOrder !== null) { //sets our savedCards and order to the local storage values
        orderList = taskOrder;
    };
    if (taskList !== null) {
        savedCards = taskList;
    };
    submitForm.on('submit', (event) => { //event listener for submitting the form
        event.preventDefault();
        handleAddTask();
    });
    deleteTaskBtn.on('click', (event) => { //event listener for delete button
        event.stopPropagation();
        handleDeleteTask(event);
    });
    renderTaskList(); //render cards on load
});
