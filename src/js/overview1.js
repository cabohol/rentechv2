import { supabase } from "./name";

async function getDatas() {
  let { data: laptops, error } = await supabase.from("laptops").select("*");
  console.log(laptops);
  let userId = localStorage.getItem("user_id");
  // console.log(userId);
  if (error) {
    console.error("Error fetching laptops:", error.message);
  } else {
    let container = "";

    laptops.forEach((data, index) => {
      if (laptops[index].userinformation_id == userId) {
        container += `
            <div class="col">
            <div class="card" id="cards" data-id="${data.id}" >
                <img src="${data.image_path}" class="card-img-top pt-2 mx-auto" alt="...">
                <div class="card-body">
                  <div class="row text-center">
                    <h3 class="card-title">${data.model}</h3>
                    <p class="card-text"></p>
                    <div class="d-flex justify-content-center align-items-center">
                    // TODO must click the testFunction here
                    <button class="text-white custom-btn" id="index" data-index="${index}"><a style="text-decoration: none;" class="link-light">View ${index}</a></button>
                </div>
                  </div>
                </div>
            </div>
          </div>
            `;
      }
    });

    document.getElementById("cardsContainer").innerHTML = container;
  }
}

function testFunction(index) {
  // localStorage.setItem("laptop_info", JSON.stringify(laptops[index]));
  console.log(index);
}
// [ ] Need to fix the index inside testFunction
getDatas();
document.body.addEventListener("click", function (event) {
  if (event.target.id === "index") {
    const index = parseInt(event.target.dataset.index); // Convert string to number
    testFunction(index); // Pass the index to testFunction
  }
});
