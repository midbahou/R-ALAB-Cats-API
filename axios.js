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
// const API_KEY = "live_iZsLSGdcv82tlUVsmGabE38syOMpzSL6Nr29mhyqYmeiveHn6bPJjJsAL828AhRO";



/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

//* Setting a default base URL and a default header with my API Key
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common['x-api-key'] = "live_iZsLSGdcv82tlUVsmGabE38syOMpzSL6Nr29mhyqYmeiveHn6bPJjJsAL828AhRO";


//* Now let's convert my fetch function
(function initialLoad() {

  let breeds = [];
  //* Retrieve a list of breeds from the cat API using fetch().

axios.get("/breeds")
    .then(response => {
        console.log(`API response: ${response}`);
        breeds = response.data;
        // console.log(`Breeds data: ${breeds}`);
        // return "List of Breeds: ", breeds;


        //* Create new <options> for each of these breeds, and append them to breedSelect.
          breeds.forEach(breed => {
            const options = document.createElement("option");
            options.value = breed.id; // each bread has an ID
            options.textContent = breed.name; 
            
            options.classList.add("options-list")
            breedSelect.appendChild(options);
          })   


          if (breeds.length > 0) {
              // Call getBreedInfo with the first breed
              getBreedInfo({ target: { value: breeds[0].id } });
            //   buildCarousel(breeds);
          } else {
              console.error("No breeds found.");
          }
    })
    .catch(error => {
        console.error(`Error fetching breeds: ${error}`);
    })
    
// const response = await axios("/breeds");
// console.log(response);
// breeds = response.data;
// console.log("List of Breeds: ", breeds);
})();

//* This function should execute immediately.
//? so in case this function should execute immediately we can use an Immediately Invoked Function Expression (IIFE).
// so no need to call it later
// initialLoad();



breedSelect.addEventListener("change", getBreedInfo)

// https://api.thecatapi.com/v1/breeds
// https://api.thecatapi.com/v1/images/search?breed_ids=beng
// https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${e.target.value}&api_key=${API_KEY}}
 
async function getBreedInfo (e) {
  // const breedSelectedValue = breedSelect.value; // get the selected breed
  const url = `/images/search?limit=10&breed_ids=${e.target.value}`;
  let breedsData = [];

  try {
    // progressBar.style.width = "0%";
    const response = await axios.get(url, {
        onDownloadProgress: updateProgress // pass the function here
    });
    breedsData = response.data;
    // console.log(`Breeds data: ${breedsData}`);

    // axios.get(url)
    //     .then(response => {
    //         breedsData = response.data;
    //     })
  

    const carouselContent = document.getElementById("carouselInner");
    carouselContent.innerHTML = ""; // clear previous carousel items
    console.log(carouselContent);

    infoDump.innerHTML = ""; // clear previous info
    
    // call buildCarousel with the new images
    buildCarousel(breedsData);
  
    breedsData.forEach((breed, index) => {
      // Create a new carousel item for each breed image
      const carouselElement = document.createElement("div");
      carouselElement.classList.add("carousel-item");
      if (index === 0) carouselElement.classList.add("active"); // First item active by default

      const img = document.createElement("img");
      img.src = breed.url;
      img.alt = breed.breeds[0].name;
      img.classList.add("d-block", "w-100");
      
      //* Append each of these new elements to the carousel.
      carouselElement.appendChild(img); // Add image to the carousel element
      carouselContent.appendChild(carouselElement); // Append each carousel item to the carouselInner


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
    });
    
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


function buildCarousel (catImages){
    const carouselInner = document.getElementById("carouselInner");
    carouselInner.innerHTML = "";

    catImages.forEach(img => {
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");

        const image = document.createElement("img");
        image.src = img.url;
        image.alt = "Image of the cat";
        image.classList.add("d-block", "w-100");

        carouselItem.appendChild(image);
        carouselInner.appendChild(carouselItem)
    })

    // start the carousel
    let carouselElement = document.getElementById("carouselExampleControls");
    let carousel = new bootstrap.Carousel(carouselElement);
    carousel.to(0)
}



/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

//* request interceptor
axios.interceptors.request.use(request =>{
    request.metadata = request.metadata || {};
    request.metadata = { startTime: new Date().getTime() };
    console.log("Request started at: ", request.metadata.startTime);

    // change the body cursor to indicate loading
    document.body.style.cursor = "progress";
    
    return request;
});

//* response interceptor
axios.interceptors.response.use(response => {
    response.config.metadata.endTime = new Date().getTime();
    response.durationInMS = response.config.metadata.endTime - response.config.metadata.startTime;
    console.log(`Request took ${response.durationInMS} milliseconds`);
    
    // reset progress bar width and start at 0%
    setTimeout(() => {
        document.body.style.cursor = "default";
        progressBar.style.width = "0%";
    }, 1500);

    //

    return response;
}, 
(error) => {
    error.config.metadata.endTime = new Date().getTime();
    error.durationInMS = error.config.metadata.endTime - error.config.metadata.startTime;
    console.log(`Request failed after ${error.durationInMS} milliseconds.`);

    // Reset cursor to default even if request fails
    document.body.style.cursor = "default";
    
    return error;
}
)

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

function updateProgress(progressEvent) {
    if(progressEvent.lengthComputable){
        const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
        progressBar.style.width = `${percentComplete}%`;
        
        console.log(progressEvent); // Log the entire ProgressEvent object to understand its structure
    }
}



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

/**
 * @method post
 */

export async function favourite(imgId) {
    try {
        const response = await axios.post("/favourites", {
           image_id: imgId
        });

        console.log("Successfully Added to favorites", response);
        return response
        
    } catch (error) {
        // console.error("Error adding to favorite", error);
        console.error("❌ API Error:", error.response ? error.response.data : error);
    }
  
}
// favourite()

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