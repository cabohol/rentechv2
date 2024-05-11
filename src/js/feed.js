import { supabase } from "./name";

const laptopsImageUrl = "https://vlzwiqqexbsievtuzfgm.supabase.co/storage/v1/object/public/laptops/";

let allLaptops = [];  // This array will store all laptop data

document.addEventListener("DOMContentLoaded", async () => {
  await loadAllLaptops();
});

// Function to load all laptops from the database
async function loadAllLaptops() {
  let { data: laptops, error } = await supabase.from("laptops").select("*");

  if (error) {
    console.error("Error fetching laptops:", error.message);
    return;
  }

  allLaptops = laptops;  // Store the fetched laptops globally
  displayLaptops(allLaptops);  // Display all laptops initially
}

// Function to display laptops
function displayLaptops(laptops) {
  let container = document.getElementById("cardsContainer");
  container.innerHTML = "";  // Clear the container before loading new data

  laptops.forEach((laptop) => {
    const ratingStars = renderRatingStars(laptop.ratings);
    console.log('Rating for', laptop.model, ':', ratingStars);  // Debugging output
    container.innerHTML += `
      <div class="col-lg-4 py-2">
        <div class="card mx-auto" data-id="${laptop.id}">
          <img src="${laptopsImageUrl}${laptop.image_path}" class="card-img-top pt-3" alt="${laptop.model}">
          <div class="card-body">
            <h3 class="card-title text-center"><a style="text-decoration: none;" href="viewmore.html?laptopId=${laptop.id}" class="link-dark">${laptop.model}</a></h3>
            <p class="card-text text-center">Php ${laptop.price}.00/hr</p>
            <p class="text-center">${ratingStars}</p>  <!-- Display stars here -->
          </div>
        </div>
      </div>
    `;
  });
}

function renderRatingStars(rating) {
  let starsFilled = parseInt(rating, 10); // Convert rating to an integer
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= starsFilled) {
      stars += `<i class="fas fa-star" style="color: #ffc700;"></i>`; // Filled star
    } else {
      stars += `<i class="far fa-star" style="color: #ccc;"></i>`; // Empty star
    }
  }
  return stars; // Returns a string with HTML for the stars
}



