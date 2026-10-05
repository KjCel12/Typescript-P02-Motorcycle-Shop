// Forces this file to be treated as an ES module, preventing global scope name collisions.
export {};

// Defines a strict string union type for allowed motorcycle categories.
type Category = 'Sport' | 'Cruiser' | 'Touring' | 'Dirt' | 'Adventure' | 'Naked' | 'Electric';

// Defines the shape/contract for an individual motorcycle object.
interface Motorcycle {
  id: string;                      // Unique identifier property as a string.
  name: string;                    // Name property of the motorcycle as a string.
  manufacturer: string;            // Brand/manufacturer name as a string.
  category: Category;              // Category must strictly match one of the literal types in the Category union.
  price: number;                   // Price property as a number.
  image_url: string;               // URL string pointing to the motorcycle image.
  created_at: Date;                // Date object indicating when the record was created.
  description: string;             // Detailed text description of the motorcycle.
  year: number;                    // Manufacturing year as a number.
  engine?: string;                 // Optional property for engine specifications, which may be undefined.
}

// Module-scoped array holding the complete master list of motorcycles fetched from the server.
let allMotorcycles: Motorcycle[] = [];

// Module-scoped array holding the currently filtered subset of motorcycles to display on screen.
let filteredMotorcycles: Motorcycle[] = [];

// Asynchronous function declaration that returns a promise resolving to an array of Motorcycles.
const fetchMotorcycles = async (): Promise<Motorcycle[]> => {
  try {
    // Awaits the network request fetching JSON data from the FreeCodeCamp API endpoint.
    const response = await fetch("https://cdn.freecodecamp.org/curriculum/labs/data/motorcycles.json");
    
    // Awaits and parses the raw HTTP response body into standard JavaScript objects/arrays.
    const data = await response.json();
    
    // Transforms each raw item object in the array...
    return data.map((item: any) => ({
      ...item,                     // Spreads all existing properties from the fetched item.
      created_at: new Date(item.created_at) // Overwrites the string date property with a proper JavaScript Date object instance.
    }));
  } catch (error) {
    // Catches any errors thrown during the fetch or parsing process and logs them.
    console.error("Failed to fetch motorcycles:", error);
    
    // Returns an empty array as a fallback so the application doesn't crash.
    return [];
  }
};

// Helper function taking a Motorcycle object and returning a formatted HTML string representation.
const renderMotorcycleCard = (motorcycle: Motorcycle): string => {
  return `
    <div class="motorcycle-card">
      <div class="motorcycle-card-image-container">
        <img src="${motorcycle.image_url}" alt="${motorcycle.name}" class="motorcycle-card-image" />
        <div class="motorcycle-card-year-badge">${motorcycle.year}</div>
      </div>
      <div class="motorcycle-card-content">
        <div class="motorcycle-card-header">
          <div>
            <h3 class="motorcycle-card-title">${motorcycle.name}</h3>
            <p class="motorcycle-card-manufacturer">${motorcycle.manufacturer}</p>
          </div>
          <span class="motorcycle-card-category">${motorcycle.category}</span>
        </div>
        <p class="motorcycle-card-description">${motorcycle.description}</p>
        <div class="motorcycle-card-footer">
          <div>
            <p class="motorcycle-card-price">$${motorcycle.price.toLocaleString()}</p>
            <p class="motorcycle-card-engine">${motorcycle.engine || 'Standard Engine'}</p>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Function responsible for updating the DOM elements with the current filtered list of motorcycles.
const renderMotorcycles = (): void => {
  // Retrieves the container DOM element where motorcycle cards will be injected.
  const gridElement = document.getElementById("motorcycle-grid");
  
  // Retrieves the DOM element displaying the total count of search/filter results.
  const resultsNumberElement = document.getElementById("results-number");

  // Checks if the grid container element actually exists in the DOM.
  if (gridElement) {
    // Sets the inner HTML of the grid element...
    gridElement.innerHTML = filteredMotorcycles
      .map((bike) => renderMotorcycleCard(bike)) // ...by mapping each motorcycle object to its corresponding HTML card string...
      .join("");                                  // ...and joining all card strings together into a single continuous HTML string.
  }

  // Checks if the results number display element exists in the DOM.
  if (resultsNumberElement) {
    // Updates the text content to show the current count of filtered motorcycles as a string.
    resultsNumberElement.textContent = filteredMotorcycles.length.toString();
  }
};

// Function to attach interactive user event listeners to DOM elements.
const setupEventListeners = () => {
  // Retrieves the search input element from the DOM and type-casts it as an HTMLInputElement.
  const searchInput = document.getElementById("name-filter-input") as HTMLInputElement;

  // Checks if the search input element exists on the page.
  if (searchInput) {
    // Listens for user typing ("input" event) in the search box.
    searchInput.addEventListener("input", (e) => {
      // Extracts the current input value, type-casts the target, and converts it to lowercase.
      const query = (e.target as HTMLInputElement).value.toLowerCase();
      
      // Filters the master list based on the search query...
      filteredMotorcycles = allMotorcycles.filter((bike) =>
        bike.name.toLowerCase().includes(query) ||         // ...matching either the motorcycle name (case-insensitive)...
        bike.manufacturer.toLowerCase().includes(query)    // ...or the manufacturer name (case-insensitive).
      );
      
      // Re-renders the UI grid with the newly filtered subset of motorcycles.
      renderMotorcycles();
    });
  }
};

// Main asynchronous entry point function to boot up the application lifecycle.
const initializeApp = async () => {
  allMotorcycles = await fetchMotorcycles();  // Fetches all data from the remote server and stores it in the master state array.
  filteredMotorcycles = [...allMotorcycles];    // Initializes the filtered state array as a copy of the master list.
  renderMotorcycles();                          // Renders all motorcycles onto the screen for the initial view.
  setupEventListeners();                        // Sets up interactive user event listeners (like search inputs).
};

// Waits for the HTML document structure to fully load before triggering the app initialization.
document.addEventListener("DOMContentLoaded", initializeApp);