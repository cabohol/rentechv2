// Importing the Supabase client initialization assumed to be configured in "name.js"
import { supabase } from "./name";

const itemsImageUrl = "https://vlzwiqqexbsievtuzfgm.supabase.co/storage/v1/object/public/laptops/";

document.addEventListener('DOMContentLoaded', async function () {
    console.log("DOMContentLoaded event fired."); // Check that the event fires correctly
    const laptopInfoString = localStorage.getItem("laptop_info");
    const laptopInfo = laptopInfoString ? JSON.parse(laptopInfoString) : null;

    if (!laptopInfo) {
        console.log("No laptop information found in local storage.");
        return;
    }

    displayLaptopDetails(laptopInfo);

    if (laptopInfo.userinformation_id) {
        try {
            const { data: userDetails, error } = await supabase
                .from("userinformation")
                .select("*")
                .eq("id", laptopInfo.userinformation_id)
                .single();

            console.log('Fetched user details:', userDetails); // Log fetched details

            if (error) {
                console.error('Failed to fetch user details:', error);
                return;
            }

            if (userDetails) {
                displayUserDetails(userDetails);
            } else {
                console.log("No user details found for the provided user ID.");
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
        }
    } else {
        console.log('No userinformation_id provided in laptopInfo');
    }

    setupRatingSubmission();
});

function displayLaptopDetails(laptopInfo) {
    console.log("Displaying laptop details:", laptopInfo); // Log the laptop info
    document.getElementById("model").textContent = laptopInfo.model || "Not available";
    document.getElementById("price").textContent = laptopInfo.price || "Not available";
    document.getElementById("specs").textContent = laptopInfo.specs || "Not available";
    document.getElementById("condition").textContent = laptopInfo.condition || "Not available";
    let imgElement = document.getElementById("image_path");
    imgElement.src = laptopInfo.image_path ? itemsImageUrl + laptopInfo.image_path : itemsImageUrl + "default_image.png";
    imgElement.alt = laptopInfo.image_path ? "Laptop Image" : "Not available";
    localStorage.setItem("laptopId", laptopInfo.id);
}

function displayUserDetails(userDetails) {
    console.log("Displaying user details:", userDetails); // Log the user details
    document.getElementById("first_name").textContent = "Name: " + userDetails.first_name + " " + userDetails.last_name;
    document.getElementById("contact_number").textContent = "Contact #: " + userDetails.contact_number;
    document.getElementById("college_name").textContent = "College: " + userDetails.college_name;
    document.getElementById("fb_link").href = userDetails.fb_link;
    document.getElementById("fb_link").children[0].textContent = userDetails.first_name + " " + userDetails.last_name;
}

function setupRatingSubmission() {
    const submitBtn = document.getElementById('feedbtn');
    if (!submitBtn) {
        console.error('Submit button not found');
        return;
    }
    submitBtn.addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent the form from submitting which would refresh the page
        await submitRating();
    });
}

async function submitRating() {
    const ratings = document.getElementsByName('rate');
    const selectedRating = Array.from(ratings).find(radio => radio.checked)?.value;
    const laptopId = localStorage.getItem("laptopId");

    if (!selectedRating) {
        alert('Please select a rating.');
        return;
    }
    if (!laptopId) {
        console.error('No laptop ID found for updating rating.');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('laptops')
            .update({ ratings: selectedRating })
            .match({ id: laptopId });

        if (error) {
            console.error('Error updating rating in Supabase:', error);
            return;
        }

        console.log('Rating successfully updated in Supabase:', data);
        window.location.href = 'feed.html'; // Redirect to the feed page after successful update
    } catch (err) {
        console.error('Failed to save rating:', err);
    }
}
