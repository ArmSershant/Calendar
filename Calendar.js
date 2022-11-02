class HTML {
  static element(name, target, attr) {
    let elm = document.createElement(name)
    for (let key in attr) {
      elm[key] = attr[key]
    }
    target.append(elm)

    return elm
  }
}

class Calendar extends HTMLElement {
  currentDate = null
  days = []

  constructor() {
    super()
    this.root = this.attachShadow({ mode: "open" })

    let month = this.getAttribute("month") - 1
    let year = +this.getAttribute("year")
    this.currentDate = new Date(year, month, 1)
    this.loadCalendar()
  }
  prev() {
    const { currentDate } = this
    currentDate.setMonth(currentDate.getMonth() - 1)
    this.loadCalendar()
  }
  next() {
    const { currentDate } = this
    currentDate.setMonth(currentDate.getMonth() + 1)
    this.loadCalendar()
  }
  loadStyles(){
    let style =document.createElement('style')
    style.innerHTML = `
      table{
        border:1px solid gray;
        width:90%;
        border-collapse:collapse;
        font-family:cursive;
      }
      table, tr, td, th{
        border:1px solid gray;
      }
      td,th{
        padding:20px 10px;
        font-size:30px;
        text-align:center;
      }
    `
    this.root.append(style)
  }
  loadCalendar() {
    const { currentDate } = this
    this.root.innerHTML = ""

    this.loadStyles()

    this.loadData()

    HTML.element("h1", this.root, {
      innerText: `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
    })

    HTML.element("button", this.root, {
      innerText: "PREV",
    }).addEventListener("click", () => this.prev())

    HTML.element("button", this.root, {
      innerText: "NEXT",
    }).addEventListener("click", () => this.next())

    let table = HTML.element("table", this.root, {
      border: 1,
    })

    let weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    weekNames.forEach((elm) => {
      HTML.element("th", table, { innerText: elm })
    })

    let index = 0
    let firstDay = this.days[0].wd
    let rows = Math.ceil((this.days.length + firstDay) / 7)
    for (let i = 0; i < rows; i++) {
      let R = HTML.element("tr", table)
      for (let j = 0; j < 7; j++) {
        let td = HTML.element("td", R)

        let content = index < this.days.length ? this.days[index].md : "---"
        if (i == 0) {
          if (j < firstDay) {
            td.innerText = "-"
          }else{
            td.innerText = index < this.days.length ? this.days[index++].md : "---"
          }
        }else{
          td.innerText = index < this.days.length ? this.days[index++].md : "---"
        }
        
        // content = this.days[index++].md
      }
    }
  }

  loadData() {
    const { currentDate } = this
    let m = currentDate.getMonth()

    this.days = []

    while (m == currentDate.getMonth()) {
      this.days.push({
        wd: currentDate.getDay(),
        md: currentDate.getDate(),
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    currentDate.setMonth(currentDate.getMonth() - 1)
    currentDate.setDate(1)
  }
}
customElements.define("app-calendar", Calendar)

