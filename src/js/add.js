import { supabase } from "./name";

const itemsImageUrl =
  "https://vlzwiqqexbsievtuzfgm.supabase.co/storage/v1/object/public/laptops";



  const userId = localStorage.getItem("user_id");
  console.log("User ID:", userId); // Optional: Check the retrieved user ID in the console
  
  const form_add = document.getElementById("form_add");


let for_update_id = "";


  form_add.onsubmit = async (e) => {
    e.preventDefault();
  
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
    image_data = data;

    // Error notification for upload
    if (error) {
      errorNotification(
        "Something wrong happened. Cannot upload image, image size might be too big. You may update the item's image.",
        15
      );
      console.log(error);
    }
  }

  if (for_update_id == "") {
    const { data, error } = await supabase
      .from('laptops')
      .insert([
        {
          model: formData.get("model"),
          price: formData.get("price"),
          specs: formData.get("specs"),
          condition: formData.get("condition"),
          image_path: formData.get("image_path"),
          userinformation_id: userId, // Use the retrieved user's ID here
          image_path: image_data ? image_data.path : image_path,
        },
      ])
      .select();
    if (error) {
      console.error("Error adding laptop:", error.message);
    } else {
      console.log("Laptop added successfully:", data);
      // Redirect to home page or trigger a refresh to update the displayed laptops
     /*  window.location.href = "home.html"; */
    }
  } else {
    const { data, error } = await supabase
    .from("laptops")
    .update({
      model: formData.get("model"),
      price: formData.get("price"),
      specs: formData.get("specs"),
      condition: formData.get("condition"),
      image_path: formData.get("image_path"),
      userinformation_id: userId, // Use the retrieved user's ID here
      image_path: image_data ? image_data.path : image_path,
    })
    .eq("id", for_update_id)
    .select();
    if (error == null) {
      alert("Laptop Successfully Added!");

      // Reset storage id
      for_update_id = "";
      /* reload datas */

      window.location.href ="home.html";

  } else {
    alert("Something wrong happened. Cannot add laptop.");
    console.log(error);
  }
  }
    form_add.reset();
  };