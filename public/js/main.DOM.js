document.querySelectorAll(".days").forEach((div) => {
    div.addEventListener("click", function () {
        this.classList.toggle("selected");
        //   updateSelectedValues();
    });
});


document.getElementById("submit").addEventListener("click", () => {
    const selectedValues = [];
    document.querySelectorAll(".days.selected").forEach((div) => {
        selectedValues.push(div.dataset.value);
    });

    fetch("/submit/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: selectedValues }),
    })
        
});

let detailsElem = document.querySelector('#details');
document.querySelector('.days').addEventListener('onmouseover',()=>{
    detailsElem.style.display = "block" ;
})
