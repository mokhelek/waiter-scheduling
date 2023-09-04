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



let usernameElem = document.querySelector("#username") ;

document.getElementById("submit").addEventListener("click", () => {
    const selectedValues = [];
  
    document.querySelectorAll(".days.selected").forEach((div) => {
        selectedValues.push(div.dataset.value);
    });


    axios.post(`/waiters/${usernameElem.dataset.value}`, {
        body: JSON.stringify(selectedValues),
    })
    .then(() => {
        location.reload()
    });
        
});

let detailsElem = document.querySelector('#details');
document.querySelector('.days').addEventListener('onmouseover',()=>{
    detailsElem.style.display = "block" ;
})


