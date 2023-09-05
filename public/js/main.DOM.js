document.querySelectorAll(".days").forEach((div) => {
    div.addEventListener("click", function () {
        this.classList.toggle("selected");
        //   updateSelectedValues();
    });
});

document.querySelectorAll(".booked").forEach((div) => {
    div.addEventListener("click", function () {
        this.classList.toggle("selected-already");
        //   updateSelectedValues();
    });
});

function viewBtn(id) {
    let waiterBooked = document.querySelector(`.waiter-booked${id}`);
    let dayStats = document.querySelector(`.days-stats${id}`);
    let viewBtn = document.querySelector(`.view-btn${id}`);
    waiterBooked.classList.toggle("hide");
    dayStats.classList.toggle("hide");
    viewBtn.classList.toggle("hide");
}

let usernameElem = document.querySelector("#username");

document.getElementById("submit").addEventListener("click", () => {
    const selectedValues = [];

    document.querySelectorAll(".days.selected").forEach((div) => {
        selectedValues.push(div.dataset.value);
    });

    if (selectedValues.length >= 3) {
        axios
            .post(`/waiters/${usernameElem.dataset.value}`, {
                body: JSON.stringify(selectedValues),
            })
            .then(() => {
                location.reload();
            });
    } else {
        let errorElem = document.querySelector(".errors");
        errorElem.style.display = "block";
        setTimeout(()=>{
            let errorElem = document.querySelector(".errors");
            errorElem.style.display = "none";
        },3000)
    }
});

let detailsElem = document.querySelector("#details");
document.querySelector(".days").addEventListener("onmouseover", () => {
    detailsElem.style.display = "block";
});
