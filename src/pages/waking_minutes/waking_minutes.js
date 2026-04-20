const timeTable = document.getElementById("timeTable")
console.log(timeTable)
const arr = []
for (let i = 0; i < 10; i++) {
  const row = document.createElement("div")
  row.id = `row_${i}`
  row.classList.add("row-style")
  const cells = []
  for (let j = 0; j < 10; j++) {

    const cell = document.createElement("div");

    cell.id = `cell_${i}_${j}`
    cell.classList.add("cell-style")
    const index = i * 10 + j + 1;
    cell.innerHTML = `${index}`
    cells.push(cell)

  }
  row.append(...cells)
  arr.push(row)
}
const db = []
const active_queue = []
function createComponentDetails(cell_id) {

  const container = document.createElement("div")
  const name = document.createElement("h1");
  name.innerHTML = document.getElementById(cell_id).innerHTML
  const title = document.createElement("input");
  const breakLine = document.createElement("br")
  const textArea = document.createElement("textarea")
  container.appendChild(name)
  container.appendChild(title)
  container.appendChild(breakLine)
  container.appendChild(textArea)
  return container
}


// TODO::add state to each 10 minute instace with its own title and message box 
timeTable.addEventListener("click", (event) => {
  if (event.target.id.startsWith("cell")) {
    if (active_queue.length > 0) {
      document.getElementById(active_queue[0]).classList.remove("background-red")
      active_queue.pop()
    }
    active_queue.push(event.target.id)
    document.getElementById("info").replaceChildren(createComponentDetails(event.target.id))
    event.target.classList.add("background-red")
  }
})


timeTable.append(...arr)


