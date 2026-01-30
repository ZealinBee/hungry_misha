import { Restaurant } from "../types/sodexo";

export const restaurants: Restaurant[] = [
  // ============ SODEXO RESTAURANTS ============

  // Helsinki - Sodexo
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

  // Espoo - Sodexo
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

  // Vantaa - Sodexo
  {
    id: "152",
    name: "Metropolia Myyrmäki",
    city: "Vantaa",
    address: "Leiritie 1, 01600 Vantaa",
    provider: "sodexo",
  },

  // Tampere - Sodexo
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

  // Oulu - Sodexo
  {
    id: "3305493",
    name: "Hilla and Mustikka",
    city: "Oulu",
    address: "Biologintie 5, 90014 Oulu",
    provider: "sodexo",
  },

  // Seinäjoki - Sodexo
  {
    id: "108",
    name: "Restaurant Frami",
    city: "Seinäjoki",
    address: "Kampusranta 11, 60320 Seinäjoki",
    provider: "sodexo",
  },

  // ============ JUVENES RESTAURANTS ============
  // Uses JAMIX API: https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/{customerId}/{kitchenId}
  // Juvenes customer ID: 93077

  // Tampere - Juvenes
  {
    id: "juvenes-yo",
    name: "YO Restaurant (Juvenes)",
    city: "Tampere",
    address: "Kalevantie 4, 33100 Tampere",
    provider: "juvenes",
    customerId: 93077,
    kitchenId: 13, // Yliopiston Ravintola
  },
  {
    id: "juvenes-newton",
    name: "Restaurant Newton (Juvenes)",
    city: "Tampere",
    address: "Korkeakoulunkatu 6 A, 33720 Tampere",
    provider: "juvenes",
    customerId: 93077,
    kitchenId: 6,
  },
  {
    id: "juvenes-rata",
    name: "Ravintola Rata (Juvenes)",
    city: "Tampere",
    address: "Ratapihankatu 53, 33100 Tampere",
    provider: "juvenes",
    customerId: 93077,
    kitchenId: 72,
  },
  {
    id: "juvenes-reaktori",
    name: "Ravintola Reaktori (Juvenes)",
    city: "Tampere",
    address: "Korkeakoulunkatu 8, 33720 Tampere",
    provider: "juvenes",
    customerId: 93077,
    kitchenId: 68, // Lift
  },
  {
    id: "juvenes-foobar",
    name: "Restaurant Foobar (Juvenes)",
    city: "Tampere",
    address: "Korkeakoulunkatu 1, 33720 Tampere",
    provider: "juvenes",
    customerId: 93077,
    kitchenId: 69,
  },
  {
    id: "juvenes-kerttu",
    name: "Restaurant Kerttu (Juvenes)",
    city: "Tampere",
    address: "Åkerlundinkatu 2, 33100 Tampere",
    provider: "juvenes",
    customerId: 93077,
    kitchenId: 70,
  },
  {
    id: "juvenes-arvo",
    name: "Ravintola Arvo (Juvenes)",
    city: "Tampere",
    address: "Arvo Ylpön katu 34, 33520 Tampere",
    provider: "juvenes",
    customerId: 93077,
    kitchenId: 5,
  },

  // Turku - Juvenes
  {
    id: "juvenes-block",
    name: "Restaurant Block (Juvenes)",
    city: "Turku",
    address: "Inspehtorinkatu 12, 20540 Turku",
    provider: "juvenes",
    customerId: 93077,
    kitchenId: 71,
  },

  // Helsinki - Juvenes
  {
    id: "juvenes-soos",
    name: "Restaurant SooS (Juvenes)",
    city: "Helsinki",
    address: "Lapinlahdenkatu 16, 00180 Helsinki",
    provider: "juvenes",
    customerId: 93077,
    kitchenId: 66,
  },
  {
    id: "juvenes-juniper",
    name: "Restaurant Juniper (Juvenes)",
    city: "Helsinki",
    address: "Jämeräntaival 1, 02150 Espoo",
    provider: "juvenes",
    customerId: 93077,
    kitchenId: 57,
  },
  {
    id: "juvenes-syke",
    name: "Ravintola Syke (Juvenes)",
    city: "Helsinki",
    address: "Haartmaninkatu 4, 00290 Helsinki",
    provider: "juvenes",
    customerId: 93077,
    kitchenId: 58,
  },
];

export const citiesWithRestaurants = [
  ...new Set(restaurants.map((r) => r.city)),
].sort();
