import { supabase } from "./name";

const itemsImageUrl =
  "https://vlzwiqqexbsievtuzfgm.supabase.co/storage/v1/object/public/laptops/";

const storedIndex = localStorage.getItem("index");
const dataId = localStorage.getItem("dataId");

let update_laptops = "";
const laptopDetails = async (dataId) => {
  try {
    console.log("Fetching laptop details for dataId:", dataId);

    const { data: Laptops, error } = await supabase
      .from("laptops")
      .select("*")
      .eq("id", dataId);

    let view_container = "";

    Laptops.forEach((laptop) => {
      view_container += `<div data-id="${
        laptop.image_path
      }"><img class="block my-2 border border-light border-2 rounded-circle" src="${
        itemsImageUrl + laptop.image_path
      }" width="100%" height="200rem"></div>
   `;
    });
    document.getElementById("view_cont").innerHTML = view_container;

    if (error) {
      throw error;
    }

    if (Laptops && Laptops.length > 0) {
      const laptop = Laptops[0];

      update_laptops = laptop.id;

      document.getElementById("model").value = laptop.model;
      document.getElementById("price").value = laptop.price;
      document.getElementById("specs").value = laptop.specs;
      document.getElementById("condition").value = laptop.condition;

      console.log("Laptop details fetched successfully:", laptop);
    } else {
      console.log("No laptop found with dataId:", dataId);
    }
  } catch (error) {
    console.error("Error fetching laptop details:", error);
    alert("Error fetching laptop details. Please try again later.");
  }
};

laptopDetails(dataId);

form_add.onsubmit = async (e) => {
  e.preventDefault();

  const submitButton = document.querySelector("#form_add button[type='submit']");
  submitButton.disabled = true;
  submitButton.innerHTML = `<span>Loading...</span>`;

  const formData = new FormData(form_add);

  let image_path = formData.get("image_path");
  let image_data = null;

  if (!image_path) {
    // Retrieve the last saved image path
    // Assuming you have a variable holding the last saved image path
    // Replace 'last_saved_image_path' with the variable holding the last saved image path
    image_path = last_saved_image_path;
  } else {
    // Supabase Image Upload
    const image = formData.get("image_path");
    const { data, error } = await supabase.storage
      .from("laptops")
      .upload("laptops/" + image.name, image, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) {
      console.error("Error uploading image:", error);
    } else {
      image_data = data;
    }
  }

  try {
    if (!update_laptops) {
      const { data, error } = await supabase
        .from("laptops")
        .insert([
          {
            model: formData.get("model"),
            price: formData.get("price"),
            specs: formData.get("specs"),
            condition: formData.get("condition"),
            image_path: image_data ? image_data.path : image_path,
          },
        ])
        .single();
      if (error) {
        console.error("Error adding laptop:", error);
      } else {
        alert("Laptop successfully added!");
      }
    } else {
      const { data, error } = await supabase
        .from("laptops")
        .update({
          model: formData.get("model"),
          price: formData.get("price"),
          specs: formData.get("specs"),
          condition: formData.get("condition"),
          image_path: image_data ? image_data.path : image_path,
        })
        .eq("id", update_laptops)
        .single();
      if (error) {
        console.error("Error updating laptop:", error);
      } else {
        console.log("Laptop successfully updated!");
        // Reset storage id
        update_laptops = "";
        /* reload datas */
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }

  form_add.reset();
  submitButton.disabled = false;
  submitButton.innerHTML = `Submit`;
};
