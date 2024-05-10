import { supabase } from "./name";

const itemsImageUrl = "https://vlzwiqqexbsievtuzfgm.supabase.co/storage/v1/object/public/laptops/";

document.addEventListener("DOMContentLoaded", function () {
    let laptop_info = localStorage.getItem("laptop_info");
    if (laptop_info) {
        laptop_info = JSON.parse(laptop_info);
        document.getElementById("model").value = laptop_info.model;
        document.getElementById("price").value = laptop_info.price;
        document.getElementById("specs").value = laptop_info.specs;
        document.getElementById("condition").value = laptop_info.condition;

        const imgElement = document.getElementById("image_path");
        imgElement.src = laptop_info.imagePath ? (itemsImageUrl + laptop_info.imagePath) : 'path_to_default_image.jpg';
        imgElement.alt = "Laptop Image";
    }
});

document.getElementById("buttonDelete").addEventListener("click", async function (event) {
    event.preventDefault();
    const deleteButton = document.getElementById("buttonDelete");
    deleteButton.disabled = true;
    deleteButton.textContent = 'Deleting...';

    let laptop_info = localStorage.getItem("laptop_info");
    if (laptop_info) {
        laptop_info = JSON.parse(laptop_info);

        const { error } = await supabase.from("laptops").delete().match({ id: laptop_info.id });
        if (error) {
            console.error('Delete error:', error);
            alert('Failed to delete: ' + error.message);
        } else {
            alert('Deletion successful');
            window.location.pathname = "/overview1.html";
        }
    } else {
        alert('No laptop info found');
    }

    deleteButton.disabled = false;
    deleteButton.textContent = 'Delete';
});

document.getElementById("buttonSave").addEventListener("click", async function (event) {
    event.preventDefault();
    const saveButton = document.getElementById("buttonSave");
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    const model = document.getElementById("model").value;
    const price = document.getElementById("price").value;
    const specs = document.getElementById("specs").value;
    const condition = document.getElementById("condition").value;
    const image_path = document.getElementById("image_path");
    const file = image_path.files[0];

    let laptop_info = localStorage.getItem("laptop_info");
    if (laptop_info) {
        laptop_info = JSON.parse(laptop_info);
        let imagePath = laptop_info.imagePath; // default to existing path if no new file

        if (file) {
            const filePath = `laptops/${Date.now()}-${file.name}`;
            const { error: uploadError, data: uploadData } = await supabase.storage.from('laptops').upload(filePath, file);
            if (uploadError) {
                console.error('Upload error:', uploadError);
                alert('Failed to upload image: ' + uploadError.message);
            } else {
                const { publicURL, error: urlError } = supabase.storage.from('laptops').getPublicUrl(filePath);
                if (urlError) {
                    console.error('Error getting file URL:', urlError);
                } else {
                    imagePath = publicURL; // update path to new image
                }
            }
        }

        const updatedItem = {
            id: laptop_info.id,
            model,
            price,
            specs,
            condition,
            imagePath
        };

        const { error } = await supabase.from("laptops").update(updatedItem).match({ id: updatedItem.id });
        if (error) {
            console.error('Update error:', error);
            alert('Failed to save changes: ' + error.message);
        } else {
            document.getElementById("image_path").src = imagePath; // Update the image element src to show new image
            localStorage.setItem("laptop_info", JSON.stringify(updatedItem)); // Update local storage
            window.location.pathname = "/overview1.html";
        }
    }

    saveButton.disabled = false;
    saveButton.textContent = 'Save';
});
