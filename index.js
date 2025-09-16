const input = document.getElementById("tastinput");
const btn = document.getElementById("shtodetyrebtn");
const listadet = document.getElementById("detyrat");
const filter = document.getElementById("filter");
const editmodal = document.getElementById("editmodal");
const editcontent = document.getElementById("editContent");
const cancelbutton = document.getElementById("cancelbtn");
const donebutton = document.getElementById("donebtn");
const search = document.getElementById("search");

let listadetarr = [];
let currentid = null;

// Ngarkimi i detyrave nga localStorage kur hap faqen
const storedTasks = JSON.parse(localStorage.getItem("tasks"));
if (storedTasks) {
    listadetarr = storedTasks;
    shfaqlisten();
}

// Funksioni për shfaqjen e listës
function shfaqlisten(tasks = listadetarr, filterType = "all") {
    listadet.innerHTML = "";

    tasks.forEach(detyre => {
        if (filterType === "completed" && !detyre.completed) return;
        if (filterType === "pending" && detyre.completed) return;

        const li = document.createElement("li");
        li.classList.add("listel");

        const span = document.createElement("span");
        span.textContent = detyre.text;
        span.classList.add("note-text");
        li.appendChild(span);

        if (detyre.completed) li.classList.add("completed");

        // Butoni fshi
        const button = document.createElement("button");
        button.classList.add("fshibtn");
        button.textContent = "❌";

        // Butoni edit
        const editbtn = document.createElement("button");
        editbtn.textContent = "📝";

        li.appendChild(button);
        li.appendChild(editbtn);
        listadet.appendChild(li);

        // Klik mbi li -> toggle completed
        li.addEventListener("click", function () {
            detyre.completed = !detyre.completed;
            li.classList.toggle("completed");
            localStorage.setItem("tasks", JSON.stringify(listadetarr));
        });

        // Klik mbi edit
        editbtn.addEventListener("click", function (e) {
            e.stopPropagation();
            currentid = detyre.id;
            editmodal.style.display = "flex";
            editcontent.value = li.querySelector(".note-text").textContent;
        });

        // Klik mbi delete
        button.addEventListener("click", function (e) {
            e.stopPropagation();
            listadetarr = listadetarr.filter(t => t.id !== detyre.id);
            shfaqlisten(listadetarr, filter.value); // ✅ përdor filter.value
            localStorage.setItem("tasks", JSON.stringify(listadetarr));
        });
    });
}

// Shtimi i detyrës me Enter
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Shtimi i detyrës me buton
btn.addEventListener("click", function () {
    addTask();
});

// Funksioni për shtim
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
}

// Edit cancel
cancelbutton.addEventListener("click", function () {
    editmodal.style.display = "none";
});

// Edit done
donebutton.addEventListener("click", function (e) {
    e.stopPropagation();
    const detyre = listadetarr.find(t => t.id === currentid);
    detyre.text = editcontent.value;
    localStorage.setItem("tasks", JSON.stringify(listadetarr));
    shfaqlisten(listadetarr, filter.value);
    editmodal.style.display = "none";
});

// Filtrimi i detyrave
filter.addEventListener("change", function () {
    const selectedfilter = filter.value;
    shfaqlisten(listadetarr, selectedfilter);
});

// Kërkimi
search.addEventListener("input", function () {
    const texti = search.value.toLowerCase();
    const filteredTasks = listadetarr.filter(detyre =>
        detyre.text.toLowerCase().includes(texti)
    );
    shfaqlisten(filteredTasks, filter.value);
});
