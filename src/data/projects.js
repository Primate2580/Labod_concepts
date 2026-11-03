// ADD A NEW PROJECT: copy one object, give it a unique id, put its photos in
// public/projects/<id>/ and list them in `images` (first image = cover shown
// on the grid). Nothing else needs editing. The FIRST project is the home hero.
const projects = [
  {
    id: "labod-concepts",
    title: "Labod Concepts",
    location: "Lagos, Nigeria",
    category: "Interior",
    year: 2025,
    sqft: 3672,
    cover: "/projects/labod-concepts/cover.jpg",
    focus: "center", // hero crop on tall/narrow screens, e.g. "30% center" or "70% center"
    images: [
      "/projects/labod-concepts/cover.jpg",
      "/projects/labod-concepts/02.jpg",
      "/projects/labod-concepts/03.jpg",
    ],
  },
  {
    id: "harbour-residence",
    title: "Harbour Residence",
    location: "Lagos, Nigeria",
    category: "Residential",
    year: 2024,
    sqft: 5200,
    cover: "/projects/harbour-residence/cover.jpg",
    images: [
      "/projects/harbour-residence/cover.jpg",
      "/projects/harbour-residence/02.jpg",
      "/projects/harbour-residence/03.jpg",
    ],
  },
  {
    id: "ridge-pavilion",
    title: "Ridge Pavilion",
    location: "Abuja, Nigeria",
    category: "Residential",
    year: 2024,
    sqft: 2800,
    cover: "/projects/ridge-pavilion/cover.jpg",
    images: [
      "/projects/ridge-pavilion/cover.jpg",
      "/projects/ridge-pavilion/02.jpg",
      "/projects/ridge-pavilion/03.jpg",
    ],
  },
  {
    id: "atrium-offices",
    title: "Atrium Offices",
    location: "Lagos, Nigeria",
    category: "Commercial",
    year: 2023,
    sqft: 14500,
    cover: "/projects/atrium-offices/cover.jpg",
    images: [
      "/projects/atrium-offices/cover.jpg",
      "/projects/atrium-offices/02.jpg",
      "/projects/atrium-offices/03.jpg",
    ],
  },
];

export default projects;
