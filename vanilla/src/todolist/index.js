function removeIt(element) {
  element.remove()
}

function addTask() {
  const tasks = [];

  function handlerAddTask(event) {
    event.preventDefault()

    const data = new FormData(event.target)
    const tasksWrapper = document.querySelector('.tasksWrapper')

    function getTaskData(formDataEntries) {
      const task = {};

      for(let field of formDataEntries) {
        const fieldName = field[0];
        const value = field[1];

        task[fieldName] = value
      }

      return task
    }

    const taskData = getTaskData(data.entries())

    tasks.push(taskData)


    tasksWrapper.innerHTML = ''

    tasks.forEach(task => {
      addTaskCard(task)
    })
  }

  function addTaskCard({title, date, time}) {
    const card = document.createElement('div');
    card.classList.add('tasksWrapper__task');

    card.addEventListener('click', event => {
      removeIt(event.target)
    })
    
    card.innerHTML = `
      <div class="taskWrapper__task__content">
        <h1 class="tasksWrapper__task--title">${title}</h1>
        <h2 class="tasksWrapper__task--subtitle">${date} - ${time}</h2>
      </div>
    `
    const tasksWrapper = document.querySelector('.tasksWrapper')

    tasksWrapper.appendChild(card);    
  }

  return handlerAddTask
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.addTask__form');

  form.addEventListener('submit', addTask())
})