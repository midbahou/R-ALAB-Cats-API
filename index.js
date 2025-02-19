import * as Carousel from "./Carousel.js";
// import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_iZsLSGdcv82tlUVsmGabE38syOMpzSL6Nr29mhyqYmeiveHn6bPJjJsAL828AhRO";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
(async function initialLoad() {

  let breeds = [];
  //* Retrieve a list of breeds from the cat API using fetch().
  try {
    const response = await fetch("https://api.thecatapi.com/v1/breeds", {
      headers: {
        'x-api-key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fitch breeds!")
    }

    console.log(response);
    
    breeds = await response.json();
    console.log("List of Breeds: ", breeds);
  
    
    //* Create new <options> for each of these breeds, and append them to breedSelect.
      breeds.forEach(breed => {
        const options = document.createElement("option");
        options.value = breed.id; // each bread has an ID
        options.textContent = breed.name; 
        
        options.classList.add("options-list")
        breedSelect.appendChild(options);
      })   
    
  } catch (error) {
    console.error(error);
  }

  if (breeds.length > 0) {
    // Call getBreedInfo with the first breed
    getBreedInfo({ target: { value: breeds[0].id } })
  } else {
    console.error("No breeds found.");
  }

})();

//* This function should execute immediately.
//? so in case this function should execute immediately we can use an Immediately Invoked Function Expression (IIFE).
// so no need to call it later
// initialLoad();




/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

breedSelect.addEventListener("change", getBreedInfo)

// https://api.thecatapi.com/v1/breeds
// https://api.thecatapi.com/v1/images/search?breed_ids=beng
// https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${e.target.value}&api_key=${API_KEY}}
 
async function getBreedInfo (e) {
  // const breedSelectedValue = breedSelect.value; // get the selected breed
  const url = `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${e.target.value}&api_key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': API_KEY
      }
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch breed info!");
    }

    const breedsData = await response.json();
    console.log(breedsData);
  

    const carouselContent = document.getElementById("carouselInner");
    carouselContent.innerHTML = ""; // clear previous carousel items
    console.log(carouselContent);

    infoDump.innerHTML = ""; // clear previous info
    Carousel.clear();
    
  
    breedsData.forEach((breed, index) => {
      // Create a new carousel item for each breed image
      carouselContent.appendChild(Carousel.createCarouselItem(breed.url, breed.breeds[0].name));
      // const carouselElement = document.createElement("div");
      // carouselElement.classList.add("carousel-item");
      // if (index === 0) carouselElement.classList.add("active"); // First item active by default

      // const img = document.createElement("img");
      // img.src = breed.url;
      // img.alt = breed.breeds[0].name;
      // img.classList.add("d-block", "w-100");
      
      // //* Append each of these new elements to the carousel.
      // carouselElement.appendChild(img); // Add image to the carousel element
      // carouselContent.appendChild(carouselElement); // Append each carousel item to the carouselInner


      //? Use the other data you have been given to create an informational section within the infoDump element.
      const breedInfo = document.createElement("div");
      breedInfo.classList.add("breed-info");

      breedInfo.innerHTML = `
      <h2>${breed.breeds[0].name}</h2>
      <p><strong>Origin:</strong> ${breed.breeds[0].origin}</p>
      <p><strong>Weight:</strong> ${breed.breeds[0].weight.metric} kg</p>
      <p><strong>Life Span:</strong> ${breed.breeds[0].life_span} years</p>
      <p><strong>Temperament:</strong> ${breed.breeds[0].temperament}</p>
      <p><strong>Description</strong>${breed.breeds[0].description}</p>
      <a href=${breed.breeds[0].wikipedia_url} target="_blank">Learn more</a>
      `;

      infoDump.appendChild(breedInfo);



      
      // console.log(breed.url);
      // console.log(breed.breeds[0].name);
      // console.log(breed.breeds[0].description);
      // console.log(breed.breeds[0].weight);
      // console.log(breed.breeds[0].life_span);
      // console.log(breed.breeds[0].origin);
      // console.log(breed.breeds[0].temperament);
    })
    Carousel.start();
    
    // **Restart the carousel**

    //? Bootstrap-specific method to reset carousel to the first slide
    // In case to do this step, I did some research and I found out that 
    // we can do it with two methods, either with jQuery or Bootstrap, since
    // I'm not familiar with jQuery I choose to use Bootstrap's build-in methods like this:

    let carouselElement = document.querySelector("#carouselExampleControls");
    let carousel = new bootstrap.Carousel(carouselElement);
    carousel.to(0); // Moves the carousel to the first slide

    
  } catch (error) {
    console.error(error);
  }
}





// wrong understanding of the questions
// getBreedInfo();
// const breedInfo = document.getElementById("infoDump");
// breedInfo.value = breed.breedInfo.id;
// breedInfo.textContent = breed.breedInfo.origin;
// breedSelect.appendChild(breedInfo)

  




/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */