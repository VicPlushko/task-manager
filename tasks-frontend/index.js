//  ***************************** global constants **************************************************
const BASE_URL = 'http://localhost:3000'
const mainDiv = document.getElementById('main-div')
const morningRoutine = document.getElementById('morning-routine')
const homework = document.getElementById('homework')
const chores = document.getElementById('chores')
const bedtime = document.getElementById('bedtime')
const tasks = document.getElementById('tasks')
const newTaskForm = document.getElementById('new-task-form')
const taskFormDiv = document.getElementById('task-form')
const morningUl = morningRoutine.querySelector('ul')
const homeworkUl = homework.querySelector('ul')
const choresUl = chores.querySelector('ul')
const bedtimeUl = bedtime.querySelector('ul')

//  ***************************** start up routine **************************************************
document.addEventListener("DOMContentLoaded", () =>{
    getAllTasks()
    tasks.addEventListener('click', () => {
        event.preventDefault()
        getAllTasks()

    })
});


//  **************************** requests to backend ************************************************
function getAllTasks() {
    taskFormDiv.innerHTML = ''
    
    fetch(BASE_URL + '/tasks')
    .then(response => response.json())
    .then(allTasks => {
        morningUl.innerHTML = ''
        homeworkUl.innerHTML = ''
        choresUl.innerHTML = ''
        bedtimeUl.innerHTML = ''
        allTasks.forEach(function(task) {
           if (task.routine === "Morning") {
            morningUl.innerHTML += makeTaskList(task)
           } else if (task.routine === "Homework") {
               homeworkUl.innerHTML += makeTaskList(task)
           } else if (task.routine === "Chore") {
               choresUl.innerHTML += makeTaskList(task)
           } else if (task.routine === "Bedtime") {
               bedtimeUl.innerHTML += makeTaskList(task)
           } else {
               console.log("in else", task.name, task.instructions)
           }
        
        });
        clickOnTasks()
    });
};

function showTask() {
    
    event.preventDefault()
    const taskId = event.target.dataset.id

    fetch(BASE_URL + '/tasks/' + taskId)
    .then(response => response.json())
    .then(task => {
        if (task.routine === "Morning") {
            morningUl.innerHTML = ""
            showSingleTask(task)
        } else if (task.routine === "Homework") {
            homeworkUl.innerHTML = ""
            showSingleTask(task)
        } else if (task.routine === "Chore") {
            choresUl.innerHTML = ""
            showSingleTask(task)
        } else if (task.routine === "Bedtime") {
            bedtimeUl.innerHTML = ""
            showSingleTask(task)
        }
    
    });
    tasks.addEventListener('click', () => {
        event.preventDefault()
        getAllTasks()
    })
};

function createTask() {
    event.preventDefault()
    console.log("creating a task")
    let instructions = document.querySelectorAll('.task-instruction')
    let newArr = []
    for (let i = 0; i < instructions.length; i++) {
       newArr.push(instructions[i].value) 
    }
    debugger

    // const objArr = []
    // for (let i = 0; i < instructions.length; i++) {
    //     console.log(instructions[i].value)
    //     const instruction = {
    //         description: instructions[i].value,
    //         completed: false,
    //     }
    //     const configObj = {
    //         method: 'POST',
    //         body: JSON.stringify(instruction),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         }
    //     }
    //     fetch(BASE_URL + '/instructions', configObj)
    //     .then(response => response.json())

    //  }
     console.log("finished ionstructionw")
    const task = {
        name: document.getElementById('task-name').value,
        completed: document.getElementById('completed').value,
        routine: document.getElementById('task-routine').value,
        instructions: newArr
    }

    console.log(task)
    const configObj = {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    fetch(BASE_URL + "/tasks", configObj)
    .then(response => response.json())
    .then(task => {
        if (task.routine === "Morning") {
            morningUl.innerHTML += makeTaskList(task)
           } else if (task.routine === "Homework") {
               homeworkUl.innerHTML += makeTaskList(task)
           } else if (task.routine === "Chore") {
               choresUl.innerHTML += makeTaskList(task)
           } else if (task.routine === "Bedtime") {
               bedtimeUl.innerHTML += makeTaskList(task)
           }
    })
}





//  ********** helpers for generating HTML and adding event listeners *******************************

function makeTaskList(task) {
    return (
        `<li>
            <a href="" data-id="${task.id}">${task.name}</a> - ${task.completed ? "Completed" : "Not Completed"}
        </li>`
    )
};

function taskForm() {
    return (`
        <form>
            <label for="name">Task:</label>      
            <input type="text" id="task-name" placeholder="Task Name">
            <label for="completed">Completed:</label>
            <input type="checkbox" id="completed" value="true"><br>
            <label for="routine">Routine:</label>
            <select name="routine" id="task-routine">
               <option disabled selected value> -- select a routine -- </option>
               <option value="Morning">Morning</option>
               <option value="Homework">Homework</option>
               <option value="Chore">Chores</option>
               <option value="Bedtime">Bedtime</option>
            </select><br>
            <input type="submit">
        </form>
    `)
};

function addFormInputs() {
    const newForm = document.querySelector('form');
    const addBtn = document.createElement('button');
    taskFormDiv.appendChild(addBtn)
    addBtn.innerHTML = "Add an Instruction"

    let counter = 0;
    let addInput = function() {
        counter++;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-instruction'
        input.placeholder = 'Instruction ' + counter;
        newForm.appendChild(input);

    };
    addBtn.addEventListener('click', function() {
        addInput();
    }.bind(this));
};



function showNewForm() {
    const taskFormHTML = taskForm()
    taskFormDiv.innerHTML += taskFormHTML
    addFormInputs()
    document.querySelector("form").addEventListener('submit', createTask)
    
};





function showSingleTask(task) {
    console.log(task)
    const div = document.createElement('div');
    div.className = "show-task"
    let taskH3 = document.createElement('h3')
    taskH3.innerHTML = `${task.name}`
    let ul = document.createElement('ul')
    
    let instructions = task.instructions
    
    for (let i = 0; i < instructions.length; i++) {
        const li = document.createElement('li')
        const checkbox = document.createElement('input')
        // const deleteBtn = document.createElement('button')
        // deleteBtn.id = 'delete'
        // deleteBtn.setAttribute('data-id', `${task.id}`)
        // const editBtn = documennt.createElement('button')

        checkbox.type = "checkbox"
        checkbox.className = "checkbox"
        checkbox.checked = false
        li.appendChild(checkbox)

        const text = document.createTextNode(`${instructions[i].description}`)
        li.appendChild(text)
        
        ul.appendChild(li)
        div.appendChild(taskH3)
        div.appendChild(ul)
        if (task.routine === "Morning") {
            morningUl.appendChild(div)
        } else if (task.routine === "Homework") {
            homeworkUl.appendChild(div)
        } else if (task.routine === "Chore") {
            choresUl.appendChild(div)
        } else if (task.routine === "Bedtime") {
            bedtimeUl.appendChild(div)
        }
    }
}

function clickOnTasks() {
    const liLinks = document.querySelectorAll("li a")

    liLinks.forEach(aTag => {
        aTag.addEventListener('click', showTask)
    })
    
    newTaskForm.addEventListener('click', showNewForm)
}

// function clickOnCheckbox() {
//     const cb = document.querySelectorAll(".checkbox")
    
//     cb.addEventListener('click', changeCompletedStatus)
//     debugger
// }

// function changeCompletedStatus(instructions) {
//     document.querySelectorAll(".checkbox").onclick = function() {
//         if (this.checked) {
//             instructions.completed = true
//         } else {
//             instructions.completed = false
//         }
        
//     }
// }