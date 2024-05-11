// Importing the Supabase client initialization assumed to be configured in "name.js"
import { supabase } from "./name";

const itemsImageUrl = "https://vlzwiqqexbsievtuzfgm.supabase.co/storage/v1/object/public/laptops/";

document.addEventListener("DOMContentLoaded", function () {
    const imgElement = document.getElementById("image_display");
    const defaultImagePath = 'path_to_correct_default_image.jpg';
    let laptop_info = localStorage.getItem("laptop_info");

    if (laptop_info) {
        laptop_info = JSON.parse(laptop_info);
        document.getElementById("model").value = laptop_info.model;
        document.getElementById("price").value = laptop_info.price;
        document.getElementById("specs").value = laptop_info.specs;
        document.getElementById("condition").value = laptop_info.condition;
        imgElement.src = laptop_info.image_path ? (itemsImageUrl + laptop_info.image_path) : defaultImagePath;
    } else {
        imgElement.src = defaultImagePath;
    }

    setupSaveButton();
    setupDeleteButton();
});

function setupSaveButton() {
    const saveButton = document.getElementById("buttonSave");
    if (!saveButton) {
        console.error("Save button not found.");
        return;
    }

    saveButton.addEventListener("click", async function (event) {
        event.preventDefault();
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        const model = document.getElementById("model").value;
        const price = document.getElementById("price").value;
        const specs = document.getElementById("specs").value;
        const condition = document.getElementById("condition").value;
        const form = document.getElementById("form_add");
        const formData = new FormData(form);
        const image = formData.get("image_path");

        if (!image || image.size === 0) {
            console.error("No image file selected or file is empty.");
            saveButton.disabled = false;
            saveButton.textContent = 'Save';
            return;
        }
        
        try {
            const { data: storageData, error: storageError } = await supabase.storage
                .from('laptops')
                .upload('public/' + image.name, image, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (storageError) {
                throw new Error('Failed to upload image: ' + storageError.message);
            }

            const image_path = storageData.Key; // Ensure this key is correctly handled
            let laptop_info = JSON.parse(localStorage.getItem("laptop_info") || '{}');
            if (laptop_info.id) {
                await updateItem({...laptop_info, model, price, specs, condition, image_path});
            }
        } catch (error) {
            console.error(error.message);
            alert(error.message);
            saveButton.disabled = false;
            saveButton.textContent = 'Save';
        }
    });
}

function setupDeleteButton() {
    const deleteButton = document.getElementById("buttonDelete");
    if (!deleteButton) {
        console.error("Delete button not found.");
        return;
    }

    deleteButton.addEventListener("click", async function (event) {
        event.preventDefault();
        deleteButton.disabled = true;
        deleteButton.textContent = 'Deleting...';

        let laptop_info = JSON.parse(localStorage.getItem("laptop_info") || '{}');
        if (laptop_info.id) {
            const { error } = await supabase.from("laptops").delete().match({ id: laptop_info.id });
            if (error) {
                console.error('Delete error:', error);
                alert('Failed to delete: ' + error.message);
                deleteButton.disabled = false;
                deleteButton.textContent = 'Delete';
            } else {
                alert('Deletion successful');
                localStorage.removeItem("laptop_info");
                window.location.pathname = "/overview1.html";
            }
        } else {
            alert('No laptop info found');
            deleteButton.disabled = false;
            deleteButton.textContent = 'Delete';
        }
    });
}

async function updateItem(updatedItem) {
    const { data, error } = await supabase
        .from("laptops")
        .update({
            model: updatedItem.model, 
            price: updatedItem.price, 
            specs: updatedItem.specs, 
            condition: updatedItem.condition, 
            image_path: updatedItem.image_path
        })
        .eq("id", updatedItem.id)
        .select();

    if (error) {
        console.error('Update error:', error);
        alert('Failed to save changes: ' + error.message);
    } else {
        window.location.pathname = "/overview1.html"; // Adjust the URL as needed
    }
}
