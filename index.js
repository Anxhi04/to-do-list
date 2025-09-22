const input = document.getElementById("tastinput");
const btn = document.getElementById("shtodetyrebtn");
const listadet = document.getElementById("detyrat");
const filter = document.getElementById("filter");
const editmodal = document.getElementById("editmodal");
const editcontent = document.getElementById("editContent");
const cancelbutton = document.getElementById("cancelbtn");
const donebutton = document.getElementById("donebtn");
const search = document.getElementById("search");
const nrtotal= document.getElementById("nrtotal");
const nrpending= document.getElementById("nrpending");
const nrdone = document.getElementById("nrdone");

let detyratotal= 0;
let detyrapending=0;
let detyradone=0;

let listadetarr = [];
let currentid = null;

const storedTasks = JSON.parse(localStorage.getItem("tasks"));
if (storedTasks) {
    listadetarr = storedTasks;
    shfaqlisten();
}

function shfaqlisten(tasks = listadetarr, filterType = "all") {
    updateNrDet();
    listadet.innerHTML = "";

    tasks.forEach(detyre => {
        if (filterType === "completed" && !detyre.completed) return;
        if (filterType === "pending" && detyre.completed) return;

        const li = document.createElement("li");
        li.classList.add("listel");
       
        const checkbox = document.createElement("div");
        checkbox.classList.add("checkbox-box");
        checkbox.textContent = detyre.completed ? "✔️" : "⭕";
        li.appendChild(checkbox);

        const textBox= document.createElement("div");
        textBox.classList.add("text-box");
        const span = document.createElement("span");
        span.textContent = detyre.text;
        span.classList.add("note-text");
        textBox.appendChild(span);
        li.appendChild(textBox);

        const actions = document.createElement("div");
        actions.classList.add("actions");

        const button = document.createElement("button");
        button.classList.add("fshibtn");
        button.textContent = "❌";

        const editbtn = document.createElement("button");
        editbtn.classList.add("editbtn");
        editbtn.textContent = "📝";

        li.appendChild(button);
        li.appendChild(editbtn);
        li.appendChild(actions);
        listadet.appendChild(li);

        if (detyre.completed) {
            li.classList.add("completed");
        }; 
            

        li.addEventListener("click", function () {
            detyre.completed = !detyre.completed;
            li.classList.toggle("completed");
            checkbox.textContent=detyre.completed ? "✔️" : "⭕";
            localStorage.setItem("tasks", JSON.stringify(listadetarr));
            updateNrDet();
        });

        editbtn.addEventListener("click", function (e) {
            e.stopPropagation();
            currentid = detyre.id;
            editmodal.style.display = "flex";
            editcontent.value = li.querySelector(".note-text").textContent;
        });

        button.addEventListener("click", function (e) {
            e.stopPropagation();
            listadetarr = listadetarr.filter(t => t.id !== detyre.id);
            shfaqlisten(listadetarr, filter.value);
            localStorage.setItem("tasks", JSON.stringify(listadetarr));
            updateNrDet();
        });
    });
}

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

btn.addEventListener("click", function () {
    addTask();
});

function addTask() {
    const text = input.value.trim();
    if (text === "") return;

    let detyre = {
        id: Date.now(),
        text: text,
        completed: false
    };

    listadetarr.push(detyre);
    shfaqlisten(listadetarr, filter.value);
    localStorage.setItem("tasks", JSON.stringify(listadetarr));
    input.value = "";
    updateNrDet();
}

cancelbutton.addEventListener("click", function () {
    editmodal.style.display = "none";
});

donebutton.addEventListener("click", function (e) {
    e.stopPropagation();
    const detyre = listadetarr.find(t => t.id === currentid);
    detyre.text = editcontent.value;
    localStorage.setItem("tasks", JSON.stringify(listadetarr));
    shfaqlisten(listadetarr, filter.value);
    editmodal.style.display = "none";
});

filter.addEventListener("change", function () {
    const selectedfilter = filter.value;
    shfaqlisten(listadetarr, selectedfilter);
});

search.addEventListener("input", function () {
    const texti = search.value.toLowerCase();
    const filteredTasks = listadetarr.filter(detyre =>
        detyre.text.toLowerCase().includes(texti)
    );
    shfaqlisten(filteredTasks, filter.value);
});
function updateNrDet(){
    let total = listadetarr.length;
    let done = listadetarr.filter(t=>t.completed).length;
    let pending = total-done;

    nrtotal.textContent= total;
    nrdone.textContent=done;
    nrpending.textContent=pending;

    localStorage.setItem("nrdet", JSON.stringify({
        total:total,
        pending:pending,
        done:done
    }));

}


