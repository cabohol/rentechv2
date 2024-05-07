import { supabase } from "./name";

// Fetch elements once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  let laptop_info = localStorage.getItem("laptop_info");

  // Check if laptop_info exists and parse it
  if (laptop_info) {
    laptop_info = JSON.parse(laptop_info);
    document.getElementById("model").value = laptop_info.model;
    document.getElementById("price").value = laptop_info.price;
    document.getElementById("specs").value = laptop_info.specs;
    document.getElementById("condition").value = laptop_info.condition;

    // Set the image path in a separate element
    const imagePath = laptop_info.image_path;
    document.getElementById("image_path").textContent = imagePath;
  }
});

document
  .getElementById("buttonDelete")
  .addEventListener("click", async function (event) {
    let laptop_info = localStorage.getItem("laptop_info");
    await deleteItem(JSON.parse(laptop_info).id);
  });
document
  .getElementById("buttonSave")
  .addEventListener("click", async function (event) {
    let laptop_info = localStorage.getItem("laptop_info");
    await updateItem(JSON.parse(laptop_info));
  });

async function deleteItem(id) {
  const { error } = await supabase.from("laptops").delete().eq("id", id);
  window.location.pathname = "/overview1.html"; // Adjust the URL as needed
}
async function updateItem(objectItem) {
  const { data, error } = await supabase
    .from("laptops")
    .update({ model: "otherValue", price: "otherValue", specs: "otherValue",  condition: "otherValue", imagePath: "otherValue",})
    .eq("id", objectItem.id)
    .select();
  window.location.pathname = "/overview1.html"; // Adjust the URL as needed
}
