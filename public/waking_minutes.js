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
    const index = (j + 1) * 10 + i + 1;
    cell.innerHTML = `${index}`
    cells.push(cell)

  }
  row.append(...cells)

  arr.push(row)
}
timeTable.append(...arr)


