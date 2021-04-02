function done(element) {
  const doneContainer = document.querySelector('.addTask__done');

  element.querySelectorAll('button').forEach(function (button) {
    console.log(button)
    removeIt(button)
  })

  doneContainer.appendChild(element.cloneNode(true))

  removeIt(element);
}

function removeIt(element) {
  element.remove()
}

function addTask() {
  let tasks = [];

  function handlerAddTask(event) {
    event.preventDefault()

    const data = new FormData(event.target)
    const tasksWrapper = document.querySelector('.tasksWrapper')

    function getTaskData(formDataEntries) {
      const task = {
        id: Date.now() + Math.ceil(Math.random() * 100)
      };

      for (let field of formDataEntries) {
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

    localStorage.setItem('todoItemsTasks', JSON.stringify(tasks));

  }

  function addTaskCard({ id, title, date, time }) {
    const cardWrapper = document.createElement('div');
    const card = document.createElement('div');
    const tasksWrapper = document.querySelector('.tasksWrapper')
    const cardFooter = document.createElement('div');
    const buttonDone = document.createElement('button');
    const buttonRemove = document.createElement('button');

    cardWrapper.appendChild(card)

    cardWrapper.dataset.id = id;

    cardWrapper.classList.add('tasksWrapper__taskCardWrapper')

    card.classList.add('tasksWrapper__task');

    card.addEventListener('click', event => {
      done(event.target)
    })

    card.innerHTML = `
      <div class="taskWrapper__task__content">
        <h1 class="tasksWrapper__task--title">${title}</h1>
        <h2 class="tasksWrapper__task--subtitle">${date} - ${time}</h2>
      </div>
    `

    buttonDone.setAttribute('type', 'button');
    buttonDone.onclick = () => {
      removeTask(buttonDone.closest('.tasksWrapper__taskCardWrapper').dataset.id)
      done(buttonDone.closest('.tasksWrapper__taskCardWrapper'))
    }

    buttonDone.textContent = 'Feito';

    buttonRemove.setAttribute('type', 'button');
    buttonRemove.onclick = () => {
      removeTask(buttonRemove.closest('.tasksWrapper__taskCardWrapper').dataset.id)
      removeIt(document.querySelector(`[data-id="${id}"]`))
    }
    buttonRemove.textContent = 'Remover';

    cardFooter.appendChild(buttonDone)
    cardFooter.appendChild(buttonRemove)

    cardWrapper.appendChild(cardFooter)

    tasksWrapper.appendChild(cardWrapper);
  }

  function removeTask(id) {
    const newTasks = tasks.reduce((acc, item) => {
      if (item.id != id) {
        acc.push(item)
      }

      return acc
    }, [])

    tasks = newTasks;
  }

  function loadTasks(data) {
    if (data) {
      tasks = data

      tasks.forEach(task => {
        addTaskCard(task)
      })
    }
  }

  return {
    handler: handlerAddTask,
    loadTasks
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.addTask__form');
  const task = addTask();
  const tasksData = JSON.parse(localStorage.getItem('todoItemsTasks'))

  form.addEventListener('submit', task.handler)

  task.loadTasks(tasksData)
})