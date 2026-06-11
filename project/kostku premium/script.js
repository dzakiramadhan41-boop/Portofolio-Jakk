const search =
document.getElementById("search");

search.addEventListener("keyup",()=>{

    const value =
    search.value.toLowerCase();

    const cards =
    document.querySelectorAll(".kost-card");

    cards.forEach(card=>{

        const text =
        card.textContent.toLowerCase();

        card.style.display =
        text.includes(value)
        ? "block"
        : "none";

    });

});

function showDetail(
    name,
    location,
    price,
    facility
){

    document.getElementById(
        "kostName"
    ).textContent = name;

    document.getElementById(
        "kostLocation"
    ).textContent =
    "📍 " + location;

    document.getElementById(
        "kostPrice"
    ).textContent =
    "💰 " + price;

    document.getElementById(
        "kostFacility"
    ).textContent =
    "✅ " + facility;

    document.getElementById(
        "modal"
    ).style.display =
    "block";

}

function closeModal(){

    document.getElementById(
        "modal"
    ).style.display =
    "none";

}
document.getElementById("totalKost")
.textContent =
document.querySelectorAll(".kost-card").length;
const themeBtn =
document.getElementById("themeBtn");

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle(
        "light-mode"
    );

    localStorage.setItem(
        "theme",
        document.body.classList.contains(
            "light-mode"
        )
    );

});
if(
localStorage.getItem("theme")
=== "true"
){
    document.body.classList.add(
        "light-mode"
    );
}
function showToast(message){

    const toast =
    document.getElementById("toast");

    toast.textContent =
    message;

    toast.style.opacity =
    "1";

    setTimeout(()=>{

        toast.style.opacity =
        "0";

    },2000);

}
function toggleFavorite(el){

    const kostName =
    el.closest(".kost-card")
    .querySelector("h3")
    .innerText;

    let favorites =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];

    if(el.textContent === "🤍"){

        el.textContent = "❤️";

        favorites.push(kostName);

    }else{

        el.textContent = "🤍";

        favorites =
        favorites.filter(
            item => item !== kostName
        );

    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}
const cards =
document.querySelectorAll(
".kost-card"
);

const random =
Math.floor(
Math.random() * cards.length
);

cards[random]
.classList.add(
"featured"
);
