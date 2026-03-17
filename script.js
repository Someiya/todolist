const input = document.getElementById("taskInput")
const addBtn = document.getElementById("addBtn")

const todoList = document.getElementById("taskList")
const completedList = document.getElementById("completedList")

const taskCount = document.getElementById("taskCount")
const clearBtn = document.getElementById("clearCompleted")

const darkToggle = document.getElementById("darkToggle")
const filterButtons = document.querySelectorAll(".filters button")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []
let currentFilter = "all"

const todoCard = todoList.closest(".card")
const completedCard = completedList.closest(".card")

tasks.forEach(task => {
  createTask(task)
})

updateCounter()
applyFilter()
setActiveFilterButton()

addBtn.addEventListener("click", addTask)

input.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    addTask()
  }
})

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter || "all"
    applyFilter()
    setActiveFilterButton()
  })
})

function addTask() {
  const text = input.value.trim()
  if (text === "") return

  const task = {
    text: text,
    done: false,
    createdAt: new Date().toISOString()
  }

  tasks.push(task)
  saveTasks()
  createTask(task)

  input.value = ""
  updateCounter()
  applyFilter()
}

function createTask(task) {
  const li = document.createElement("li")

  const span = document.createElement("span")
  span.textContent = task.text

  const dateSpan = document.createElement("span")
  dateSpan.classList.add("date")

  const createdAt = task.createdAt || task.createAt || new Date().toISOString()
  dateSpan.textContent = new Date(createdAt).toLocaleDateString("th-TH")

  const actions = document.createElement("div")
  actions.classList.add("actions")

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.checked = task.done

  const deleteBtn = document.createElement("button")
  deleteBtn.classList.add("delete")

  deleteBtn.innerHTML = `
<svg class="trash-icon" viewBox="0 0 24 24">
<path d="M9 3h6l1 2h5v2H3V5h5l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM6 9h2v9H6V9z"/>
</svg>
  `

  checkbox.addEventListener("change", () => {
    task.done = checkbox.checked

    if (task.done) {
      span.classList.add("completed")
      completedList.appendChild(li)
    } else {
      span.classList.remove("completed")
      todoList.appendChild(li)
    }

    saveTasks()
    updateCounter()
    applyFilter()
  })

  deleteBtn.addEventListener("click", () => {
    li.remove()
    tasks = tasks.filter(t => t !== task)
    saveTasks()
    updateCounter()
    applyFilter()
  })

  actions.appendChild(checkbox)
  actions.appendChild(deleteBtn)

  li.appendChild(span)
  li.appendChild(dateSpan)
  li.appendChild(actions)

  if (task.done) {
    span.classList.add("completed")
    completedList.appendChild(li)
  } else {
    todoList.appendChild(li)
  }
}

function updateCounter() {
  const remaining = tasks.filter(t => !t.done).length
  if (remaining === 0) {
    taskCount.textContent = "ไม่มีงานค้าง"
  } else if (remaining === 1) {
    taskCount.textContent = "เหลือ 1 งาน"
  } else {
    taskCount.textContent = "เหลือ " + remaining + " งาน"
  }
}

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.done)
  completedList.innerHTML = ""
  saveTasks()
  updateCounter()
  applyFilter()
})

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

function applyFilter() {
  if (currentFilter === "active") {
    todoCard.style.display = ""
    completedCard.style.display = "none"
    return
  }
  if (currentFilter === "completed") {
    todoCard.style.display = "none"
    completedCard.style.display = ""
    return
  }
  todoCard.style.display = ""
  completedCard.style.display = ""
}

function setActiveFilterButton() {
  filterButtons.forEach(btn => {
    btn.classList.toggle("active", (btn.dataset.filter || "all") === currentFilter)
  })
}

/* DARK MODE */
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark")
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark")
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark")
  )
})
