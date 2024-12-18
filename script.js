const form = document.querySelector('.input-section');
const taskInput = document.querySelector('#taskInput');
const addTaskBtn = document.querySelector('#addTaskBtn');
const taskList = document.querySelector('#taskList');
const filterAll = document.querySelector('#filterAll');
const filterCompleted = document.querySelector('#filterCompleted');
const filterUncompleted = document.querySelector('#filterUncompleted');
const clearTasksBtn = document.querySelector('#clearTasksBtn');

function clearTasks() {
    localStorage.removeItem('tasks'); 
    loadTasks(); 
}

clearTasksBtn.addEventListener('click', clearTasks);

function loadTasks() {
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) {
            li.classList.add('completed');
        }

        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(index));

        li.appendChild(deleteBtn);
        li.addEventListener('click', toggleTask);
        taskList.appendChild(li);
    });
}

function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1); 
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks(); 
}

function btn_click() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTask = { text: taskText.length > 30 ? taskText.substring(0, 30) + '...' : taskText, completed: false };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
        taskInput.value = '';
    } else {
        alert('Пожалуйста, введите задачу.');
    }
}

taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        btn_click(); 
    }
});

function toggleTask(event) {
    const li = event.target;
    li.classList.toggle('completed');

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = Array.from(taskList.children).indexOf(li);
    tasks[taskIndex].completed = li.classList.contains('completed');
    localStorage.setItem('tasks', JSON.stringify(tasks));
    filterTasks();
}

function filterTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const activeFilter = document.querySelector('.filter-btn.active');

    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) {
            li.classList.add('completed');
        }

        if (
            activeFilter === filterAll ||
            (activeFilter === filterCompleted && task.completed) ||
            (activeFilter === filterUncompleted && !task.completed)
        ) {
            taskList.appendChild(li);
        }

        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(index));

        li.appendChild(deleteBtn);
        li.addEventListener('click', toggleTask);
    });
}

addTaskBtn.addEventListener('click', btn_click);
filterAll.addEventListener('click', () => {
    filterAll.classList.add('active');
    filterCompleted.classList.remove('active');
    filterUncompleted.classList.remove('active');
    filterTasks();
});
filterCompleted.addEventListener('click', () => {
    filterAll.classList.remove('active');
    filterCompleted.classList.add('active');
    filterUncompleted.classList.remove('active');
    filterTasks();
});
filterUncompleted.addEventListener('click', () => {
    filterAll.classList.remove('active');
    filterCompleted.classList.remove('active');
    filterUncompleted.classList.add('active');
    filterTasks();
});

loadTasks();