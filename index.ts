export{}

type Category = 'Sport' | 'Cruiser' | 'Touring' | 'Dirt' | 'Adventure' | 'Naked' | 'Electric';

interface Motorcycle {
  id: string;
  name: string;
  manufacturer: string;
  category: Category;
  price: number;
  image_url: string;
  created_at: Date;
  description: string;
  year: number;
  engine?: string;
}

let allMotorcycles: Motorcycle[] = [];
let filteredMotorcycles: Motorcycle[] = [];

const fetchMotorcycles = async (): Promise<Motorcycle[]> => {
  try {
    const response = await fetch("https://cdn.freecodecamp.org/curriculum/labs/data/motorcycles.json");
    const data = await response.json();
    return data.map((item: any) => ({
      ...item, 
      created_at: new Date(item.created_at)
    }));
  } catch (error) {
    console.error("Failed to fetch motorcycles:", error);
    return [];
  }
};


const renderMotorcycleCard = (motorcycle: Motorcycle): string => {
  return`
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

const renderMotorcycles = (): void => {
    const gridContainer = document.getElementById("motorcycle-grid");
    const resultsNumberElement = document.getElementById("results-number");

    if (gridContainer){
      gridContainer.innerHTML = filteredMotorcycles.map(renderMotorcycleCard).join("");
    }

    if (resultsNumberElement){
      resultsNumberElement.textContent = filteredMotorcycles.length.toString();
    }
};

const setupEventListeners = () => {
  const searchInput = document.getElementById("name-filter-input") as HTMLInputElement;

  if(searchInput){
    searchInput.addEventListener("input", (e) => {
      const query = (e.target as HTMLInputElement).value.toLowerCase();
      filteredMotorcycles = allMotorcycles.filter((motorcycle) => 
        motorcycle.name.toLowerCase().includes(query) ||
        motorcycle.manufacturer.toLowerCase().includes(query)
      );
      renderMotorcycles();
    });
  }
};

const initializeApp = async () => {
  allMotorcycles = await fetchMotorcycles();
  filteredMotorcycles = allMotorcycles; // Initialize filteredMotorcycles with allMotorcycles
  renderMotorcycles();
  setupEventListeners(); // Call the function to set up event listeners for the search input.
};

document.addEventListener("DOMContentLoaded", initializeApp);

