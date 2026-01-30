import { Restaurant } from "../types/sodexo";

export const restaurants: Restaurant[] = [
  // Helsinki
  {
    id: "1045996",
    name: "Helsinki University Main Building",
    city: "Helsinki",
    address: "Fabianinkatu 33, 00170 Helsinki",
    provider: "sodexo",
  },
  {
    id: "158",
    name: "Metropolia Myllypuro",
    city: "Helsinki",
    address: "Myllypurontie 1, 00920 Helsinki",
    provider: "sodexo",
  },

  // Espoo
  {
    id: "86",
    name: "Aalto Kvarkki",
    city: "Espoo",
    address: "Otakaari 3, 02150 Espoo",
    provider: "sodexo",
  },
  {
    id: "6754",
    name: "Aalto Tietotekniikantalo",
    city: "Espoo",
    address: "Konemiehentie 2, 02150 Espoo",
    provider: "sodexo",
  },

  // Vantaa
  {
    id: "152",
    name: "Metropolia Myyrmäki",
    city: "Vantaa",
    address: "Leiritie 1, 01600 Vantaa",
    provider: "sodexo",
  },

  // Tampere
  {
    id: "116",
    name: "Restaurant Linna",
    city: "Tampere",
    address: "Kalevantie 5, 33100 Tampere",
    provider: "sodexo",
  },
  {
    id: "111",
    name: "Hertsi ja Café Bitti",
    city: "Tampere",
    address: "Korkeakoulunkatu 1, 33720 Tampere",
    provider: "sodexo",
  },

  // Oulu
  {
    id: "3305493",
    name: "Hilla and Mustikka",
    city: "Oulu",
    address: "Biologintie 5, 90014 Oulu",
    provider: "sodexo",
  },

  // Seinäjoki
  {
    id: "108",
    name: "Restaurant Frami",
    city: "Seinäjoki",
    address: "Kampusranta 11, 60320 Seinäjoki",
    provider: "sodexo",
  },
];

export const citiesWithRestaurants = [
  ...new Set(restaurants.map((r) => r.city)),
].sort();
