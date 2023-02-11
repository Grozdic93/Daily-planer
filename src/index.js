// parse JSON string to JSON object

let myArray = JSON.parse(JSONobj);


// | | SELECTING ELEMENTS | | 

let container = document.querySelector('#grid');
let start = document.querySelector('.start');



// | | FUNCTION TO CLEAR HTML | |
function clearHTML() {
    container.innerHTML = "";

}

// | | FUNCTION FOR CREATING ELEMENTS  | |

let className = "";

function createElements() {

    clearHTML();
    for (let i = 0; i < myArray.length; i++) {
        if (myArray[i].importance < 2) {
            className = "bg-success";
        }
        else if (myArray[i].importance < 4) {
            className = "bg-warning";
        }
        else {
            className = "bg-danger";
        }
        container.innerHTML += `<div data="${i}" class="col mb-4 d-flex flex">
        <div class="card p-3 myCard" style="width: 22rem;">
            <div class="d-flex justify-content-between align-items-center">
                <span class="mb-2">
                    <button class="btn btn-info btn-small text-white fs-6 task-btn">Task</button>
                </span>
                <span><i class="fa-regular fa-bookmark"></i><i
                        class="fa-solid fa-ellipsis-vertical ms-3"></i>
                </span>
            </div>
            <img src="${myArray[i].image}" class="card-img-top img-thumbnail imgBx" alt="...">
            <div class="card-body">
                <h5 class="card-title text-center">${myArray[i].taskName}</h5>
                <p class="card-text text-center">${myArray[i].description}</p>
            </div>
            <ul class="list-group list-group-flush py-2">
                <div>
                    <i class="fa-solid fa-triangle-exclamation"></i> Priority
                    level: <span data1=${i} class="priority-level ${className}" href="#">${myArray[i].importance}</span>
                </div>
                <div class="mt-3">
                    <i class="fa-solid fa-calendar-days"></i> Deadline: <span>${myArray[i].deadline}</span>
                </div>


            </ul>
            <div class="card-bod text-end mt-3 details" data2-${i}>
                <button class="btn btn-danger delete"><i class="fa-solid fa-trash-can"></i>
                    Delete</button>
                <button class="btn btn-success done"><i class="fa-regular fa-circle-check"></i>
                    Done</button>
            </div>
        </div>
    </div>`


        // | | SETING 'DONE' CARDS TO STAY GREEN | |
        if (myArray[i].done == true) {
            container.children[i].children[0].style.backgroundColor = '#CCFFCB'
        }
        // | | ANIMATION FOR FADING IN CARDS WHEN THEY ARE CREATED| |
        container.classList.add("fadedOut")


        requestAnimationFrame(() => {
            container.style.transition = 'all 1.5s ease'
            container.classList.remove("fadedOut")

        })

    }



    for (let i = 0; i < myArray.length; i++) {
        let hoverArea = document.querySelectorAll('.myCard');
        hoverArea[i].addEventListener('mouseover', function (e) {
            let details = document.querySelectorAll('.details');
            details[i].style.opacity = '1';
            details[i].style.transition = 'all 1s ease'
            details[i].style.transform = 'translateX(0px)'
        })
        hoverArea[i].addEventListener('mouseout', function (e) {
            let details = document.querySelectorAll('.details');
            details[i].style.opacity = '0';
            details[i].style.transition = 'all 1s ease'
            details[i].style.transform = 'translateX(-50px)'
        })
    }

}

// | | ATTACHING createElements FUNCTION TO 'GET STARTED' BUTTON| |

start.addEventListener('click', createElements)




// | | SETTING UP EVENT LISTENERS FOR DELETING AND COMPLETING TASKS | |

container.addEventListener('click', function (e) {
    if (e.target.className == 'btn btn-danger delete') {
        const card = e.target.parentElement.parentElement.parentElement;
        card.style.transition = 'all 1s ease'
        card.style.opacity = '0'
        let index = card.getAttribute("data");

        setTimeout(() => {
            container.removeChild(card);
            // deleting cards also deletes obj in myArray
            myArray.splice(index, 1);
            clearHTML();
            createElements();

        }, 1000)
    }
    if (e.target.className == 'btn btn-success done') {
        const card = e.target.parentElement.parentElement.parentElement;
        card.children[0].style.transition = 'all 1s ease'
        // | | CHECKING IF CARD IS DONE OR NOT | |
        if (myArray[card.getAttribute("data")].done == false) {
            card.children[0].style.backgroundColor = '#CCFFCB'
            myArray[card.getAttribute("data")].done = true;
        }
        // | | IF CARD IS DONE, UNDO IT | |
        else {
            card.children[0].style.backgroundColor = 'white'
            myArray[card.getAttribute("data")].done = false;
        }


    }


    // | | INCREASING PRIORITY LEVEL | |

    if (e.target.className == "priority-level bg-danger" || e.target.className == "priority-level bg-warning" || e.target.className == "priority-level bg-success") {
        let index = e.target.getAttribute("data1");

        // IF PRIORITY LEVEL IS 5, DO NOT INCREASE IT
        if (e.target.innerHTML == 5) {
            e.target.innerHTML = 5;
        }
        // ELSE INCREASE IT
        else {
            myArray[index].importance = e.target.innerHTML * 1 + 1;
            e.target.innerHTML = e.target.textContent * 1 + 1
        }


        if (e.target.innerHTML > 3) {
            e.target.className = "priority-level bg-danger"
        }
        else if (e.target.innerHTML > 1) {
            e.target.className = "priority-level bg-warning"
        }
    }
})


// | | ON RIGHT CLICK DECREASE PRIORITY LEVEL | |

container.addEventListener('contextmenu', function (ev) {
    ev.preventDefault();
    if (ev.target.className == "priority-level bg-danger" || ev.target.className == "priority-level bg-warning" || ev.target.className == "priority-level bg-success") {
        let index = ev.target.getAttribute("data1");
        // IF PRIORITY LEVEL IS 0, DO NOT DECREASE IT
        if (ev.target.innerHTML < 1) {
            ev.target.innerHTML = 0;
        }
        // ELSE DECREASE IT
        else {
            myArray[index].importance = ev.target.innerHTML * 1 - 1;
            ev.target.innerHTML = ev.target.textContent * 1 - 1;
        }
        if (ev.target.innerHTML < 2) {
            ev.target.className = "priority-level bg-success"
        }
        else if (ev.target.innerHTML < 4) {
            ev.target.className = "priority-level bg-warning"
        }

        return false;
    }
}, false)

// | | SORTING TASKS | |

let sort = document.querySelector('.sort');


sort.addEventListener('click', function () {

    // | | SORTING BY PRIORITY LEVEL | |
    myArray.sort(function (a, b) {
        return b.importance - a.importance;
    })
    // if its done, its gonna go to the end of the array
    myArray.sort(function (a, b) {
        return a.done - b.done;
    })
    clearHTML();
    createElements();


})


// show  details









