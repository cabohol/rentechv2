import { supabase } from "./name";

const itemsImageUrl = "https://vlzwiqqexbsievtuzfgm.supabase.co/storage/v1/object/public/laptops/";

document.addEventListener('DOMContentLoaded', async function () {
    console.log("DOMContentLoaded event fired.");
    const laptopInfoString = localStorage.getItem("laptop_info");
    const laptopInfo = laptopInfoString ? JSON.parse(laptopInfoString) : null;
    const userId = JSON.parse(localStorage.getItem("user_id"));

    console.log("User ID:", userId);

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

            if (error) {
                console.error('Failed to fetch user details:', error);
                return;
            }

            if (userDetails) {
                displayUserDetails(userDetails);

                if (userDetails.id === userId) {
                    console.log('User is viewing their own laptop. Rating disabled.');
                    alert('User is viewing their own laptop. Rating disabled.');

                    const feedbtn = document.getElementById('feedbtn');
                    if (feedbtn) {
                        feedbtn.disabled = true;
                        feedbtn.style.pointerEvents = 'none';
                        feedbtn.style.opacity = '0.5';
                    }
                } else {
                    setupRatingSubmission(userId, laptopInfo.id);
                }
            } else {
                console.log("No user details found for the provided user ID.");
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
        }
    } else {
        console.log('No userinformation_id provided in laptopInfo');
    }
});

function displayLaptopDetails(laptopInfo) {
    document.getElementById("model").textContent = "Model :  " + laptopInfo.model || "Not available";
    document.getElementById("price").textContent = "Price :  Php " + laptopInfo.price + ".00" || "Not available";
    document.getElementById("specs").textContent = "Specification :  " + laptopInfo.specs || "Not available";
    document.getElementById("condition").textContent = "Condition :  " + laptopInfo.condition || "Not available";
    let imgElement = document.getElementById("image_path");
    imgElement.src = laptopInfo.image_path ? itemsImageUrl + laptopInfo.image_path : itemsImageUrl + "default_image.png";
    imgElement.alt = laptopInfo.image_path ? "Laptop Image" : "Not available";
}

function displayUserDetails(userDetails) {
    document.getElementById("first_name").textContent = "Name : " + userDetails.first_name + " " + userDetails.last_name;
    document.getElementById("contact_number").textContent = "Contact # : " + userDetails.contact_number;
    document.getElementById("college_name").textContent = "College : " + userDetails.college_name;
    document.getElementById("fb_link").href = userDetails.fb_link;
    document.getElementById("fb_link").children[1].textContent = userDetails.first_name + " " + userDetails.last_name;
}

async function setupRatingSubmission(userId, laptopId) {
    const submitBtn = document.getElementById('feedbtn');
    if (!submitBtn) {
        console.error('Submit button not found');
        return;
    }
    submitBtn.addEventListener('click', async function(event) {
        event.preventDefault();  // Prevent the form from submitting
        await submitRating(userId, laptopId);  // Pass userId and laptopId to submitRating
    });
}

document.querySelectorAll('.rate input').forEach(input => {
    input.addEventListener('change', event => {
        if (event.target.checked) {
            const rating = parseInt(event.target.value);
            const emojiDisplay = document.getElementById('emoji-display');

            let emoji;

           switch (rating) {
    case 1:
        emoji = '<span style="font-weight: bold; font-size: 22px;">Thanks For Rating Us! 😢</span>'; // Very Bad
        break;
    case 2:
         emoji = '<span style="font-weight: bold; font-size: 22px;">Thanks For Rating Us! 🙁</span>'; // Bad
        break;
    case 3:
        emoji = '<span style="font-weight: bold; font-size: 22px;">Thanks For Rating Us! 🙂</span>'; // Good
        break;
    case 4:
        emoji = '<span style="font-weight: bold; font-size: 22px;">Thanks For Rating Us! 😃</span>'; // Very Good
        break;
    case 5:
        emoji = '<span style="font-weight: bold; font-size: 22px;">Thanks For Rating Us! 😍</span>'; // Excellent
        break;
    default:
        emoji = ''; // In case of no valid rating
}

    document.getElementById('feedbackMessage').innerHTML = emoji;

            
            emojiDisplay.style.display = 'block'; // Show the emoji display
        }
    });
});
async function submitRating(userId, laptopId) {
    const ratings = document.getElementsByName('rate');
    const selectedRating = Array.from(ratings).find(radio => radio.checked)?.value;

    if (!selectedRating) {
        alert('Please select a rating.');
        return;
    }

    try {
        const { data: existingRatings, error: ratingsError } = await supabase
            .from('ratings')
            .select('id')
            .eq('laptop_id', laptopId)
            .eq('userinformation_id', userId);

        if (ratingsError) {
            console.error('Error fetching existing ratings from Supabase:', ratingsError);
            return;
        }

        if (existingRatings.length > 0) {
            alert('You have already rated this laptop.');
            return;
        }

        const { data: ratingData, error: ratingError } = await supabase
            .from('ratings')
            .insert([{ laptop_id: laptopId, userinformation_id: userId, ratings: selectedRating }]);

        if (ratingError) {
            console.error('Error inserting rating in Supabase:', ratingError);
            return;
        }

        console.log('Rating successfully inserted in Supabase:', ratingData);
        window.location.href = 'feed.html'; // Redirect after successful operation
    } catch (err) {
        console.error('Failed to save rating:', err);
    }
}
