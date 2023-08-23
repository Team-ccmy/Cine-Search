document.addEventListener("DOMContentLoaded", function () {
    const btnSearch = document.getElementById("btn-search");
    const mainElem = document.querySelector("main");

    // Show the main content when the search button is clicked
    btnSearch.addEventListener("click", function (e) {
        e.preventDefault(); // Prevents the form from submitting
        mainElem.classList.remove("hidden");
    });

    // Initialize the collapsible elements from Materialize
    var collapsibleElems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapsibleElems);

    // Initialize the card elements from Materialize
    var cardElems = document.querySelectorAll('.card');
    M.Collapsible.init(cardElems);

    const cardsContainer = document.getElementById("cardsContainer");
    for (let i = 0; i < 5; i++) {
        let card = createCard();
        cardsContainer.appendChild(card);
    }

    function createCard() {
        let card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
        <div class="card-image waves-effect waves-block waves-light">
                  <img class="activator" src="images/office.jpg">
                </div>
                <div class="card-content">
                  <span class="card-title activator grey-text text-darken-4">Card Title<i class="material-icons right">more_vert</i></span>
                  <p><a href="#">This is a link</a></p>
                </div>
                <div class="card-reveal">
                  <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                  <p>Here is some more information about this product that is only revealed once clicked on.</p>
                </div>
        `;

        return card;
    }
});
