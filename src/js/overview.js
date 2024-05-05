import { supabase } from "./name";


const itemsImageUrl =
  "https://vlzwiqqexbsievtuzfgm.supabase.co/storage/v1/object/public/laptops/";

const form_add = document.getElementById("form_add");

let laptop_info = localStorage.getItem("laptop_info");

//const userId = localStorage.getItem("user_id");
//console.log("User ID:", userId);
console.log(laptop_info);
document.getElementById("model").value = JSON.parse(laptop_info).model;
document.getElementById("price").value = JSON.parse(laptop_info).price;
document.getElementById("specs").value = JSON.parse(laptop_info).specs;
document.getElementById("condition").value = JSON.parse(laptop_info).condition;
document.getElementById("image_path").value = JSON.parse(laptop_info).image_path;
//getDatas();
// btn_logout.onclick = doLogout;

async function getDatas() {
  let { data: laptops, error } = await supabase.from("laptops").select("*");
  /* .eq("userinformation", userId); */

  let container = "";

  laptops.forEach((data) => {

    container += `
    <div class="row align-items-center px-5 pt-3">
    <div class="col text-start">
      <button
        type="button"
        id="buttoncancel"
        data-id="${data.id}"
        class="btn btn text-white"
      >
       Delete
      </button>
    </div>
    <div class="col text-end">
      <button type="button" id="buttonsave" data-id="${data.id}" class="btn btn text-white">
       Save
      </button>
    </div>
    </div>
      `;
  });

  document.getElementById("cardsContainer").innerHTML = container;


}
// Event delegation for delete action
document.addEventListener("click", function(event) {
  if (event.target && event.target.id === "#buttoncancel") {
    deleteAction(event);
  }
});

// DELETE FUNCTIONALITY
const deleteAction = async (e) => {
  const id = e.target.getAttribute("data-id");
  alert(id);

  //e.preventDefault(); // Prevent the default action of the button
  //alert("Button Cancel Clicked");
  //console.log("Buttoncancel clicked");
}










/*form_add.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData (form_add);

  const { data, error } = await supabase
  .from('laptops')
  .insert([
    { model: formData.get("model") ,
    price: formData.get("price"),
    specs: formData.get("specs"),
    condition: formData.get("condition"),
    image_path: formData.get("image_path"),
  },
  ])
  .select();
  if (error) {
    console.error("Error adding laptop:", error.message);
} else {
    console.log("Laptop added successfully:", data);
    // Redirect to home page or trigger a refresh to update the displayed laptops
    window.location.href = "home.html";
}
};  */