export type AirportOption = {
  code: string;
  city: string;
  name: string;
  country: string;
};

export const SAMPLE_AIRPORTS: AirportOption[] = [
  {
    code: "ADD",
    city: "Addis Ababa",
    name: "Bole International",
    country: "Ethiopia",
  },
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "UAE" },
  {
    code: "IST",
    city: "Istanbul",
    name: "Istanbul Airport",
    country: "Turkey",
  },
  {
    code: "NBO",
    city: "Nairobi",
    name: "Jomo Kenyatta International",
    country: "Kenya",
  },
  { code: "CAI", city: "Cairo", name: "Cairo International", country: "Egypt" },
  {
    code: "JED",
    city: "Jeddah",
    name: "King Abdulaziz International",
    country: "Saudi Arabia",
  },
  { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar" },
  { code: "LHR", city: "London", name: "Heathrow", country: "UK" },
];
