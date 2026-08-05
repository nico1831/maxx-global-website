// Shared catalog data for the Maxx Global B2B site (placeholder content).

export const AVAIL = {
  available:    { label: "In Stock",      color: "#8fb79b", border: "#3c5a45" },
  indent:       { label: "Indent Order",  color: "#c2a768", border: "#5c4e2e" },
};

export const LEAD = {
  indent: "8–12 weeks from order confirmation",
};

export const BRANDS = [
  { key: "sportsart",   name: "SportsArt",           tagline: "The Green Fitness Company",        origin: "Woodinville, USA · Tainan, Taiwan", count: 62, eco: true },
  { key: "forceusa",    name: "Force USA",           tagline: "Built for the serious floor",       origin: "Utah, USA",                        count: 34 },
  { key: "impulse",     name: "Impulse",             tagline: "Commercial strength at scale",      origin: "Shandong, China",                  count: 58 },
  { key: "stages",      name: "Stages Cycling",      tagline: "Power meters and studio systems",   origin: "Boulder, USA",                     count: 14 },
  { key: "intenza",     name: "Intenza Fitness",     tagline: "Cardio, engineered in Taiwan",      origin: "Taiwan",                           count: 26 },
  { key: "firstdegree", name: "First Degree Fitness", tagline: "Water-resistance rowing",          origin: "Perth, Australia",                 count: 12 },
  { key: "versafit",    name: "VersaFit",            tagline: "Functional training systems",       origin: "Australia",                        count: 22 },
  { key: "fitplus",     name: "FitPlus Floor",       tagline: "Sports flooring systems",           origin: "Taiwan",                           count: 18 },
  { key: "liben",       name: "Liben",               tagline: "Play systems for public spaces",    origin: "Zhejiang, China",                  count: 26 },
  { key: "shamrock",    name: "Shamrock Arena",      tagline: "Court and arena surfaces",          origin: "Selangor, Malaysia",               count: 9 },
];

export const CATEGORIES = [
  { key: "cardio",     name: "Cardio",          count: 48, sub: "Treadmills · Ellipticals · Bikes · Rowers", img: "cardio row photo",
    children: [ ["treadmills","Treadmills",16], ["ellipticals","Ellipticals",9], ["bikes","Exercise Bikes",12], ["rowers","Rowers",6], ["steppers","Steppers & Climbers",5] ] },
  { key: "strength",   name: "Strength",        count: 86, sub: "Plate loaded · Selectorized · Racks", img: "strength floor photo",
    children: [ ["multistation","Multi-Station",11], ["plateloaded","Plate Loaded",24], ["selectorized","Selectorized",28], ["benches","Benches & Racks",15], ["freeweights","Free Weights",8] ] },
  { key: "functional", name: "Functional",      count: 34, sub: "All-in-one trainers · Rigs · Accessories", img: "functional rig photo",
    children: [ ["allinone","All-in-One Trainers",9], ["rigs","Rigs & Racks",13], ["accessories","Accessories",12] ] },
  { key: "cycling",    name: "Cycling Studio",  count: 22, sub: "Indoor cycles · Power meters · Studio systems", img: "cycling studio photo",
    children: [ ["cycles","Indoor Cycles",10], ["powermeters","Power Meters",6], ["studio","Studio Systems",6] ] },
  { key: "flooring",   name: "Flooring",        count: 18, sub: "Rubber tiles · Rolls · PVC · Platforms", img: "rubber flooring detail",
    children: [ ["tiles","Rubber Tiles",6], ["rolls","Rubber Rolls",4], ["pvc","PVC & Vinyl",5], ["platforms","Platforms",3] ] },
  { key: "playground", name: "Playground",      count: 26, sub: "Play systems · Swings · Slides", img: "playground install photo",
    children: [ ["systems","Play Systems",11], ["swings","Swings",6], ["slides","Slides",5], ["riders","Spring Riders",4] ] },
];

export const SEGMENTS = [
  { key: "hotel",  name: "Hotels & Resorts" },
  { key: "condo",  name: "Residential Condominiums" },
  { key: "corp",   name: "Corporate Fitness" },
  { key: "school", name: "Schools & Universities" },
  { key: "lgu",    name: "Government & LGU" },
  { key: "gym",    name: "Commercial Gyms" },
];

// [title, model, brandKey, catKey, subKey, availability, segments, eco, featured, sizeMB]
const P = [
  ["G690 Verde Treadmill", "G690", "sportsart", "cardio", "treadmills", "available", ["hotel","corp","gym"], true, true, 2.4],
  ["G576U Elliptical", "G576U", "sportsart", "cardio", "ellipticals", "available", ["hotel","condo","corp"], true, true, 1.8],
  ["G516 Recumbent Cycle", "G516", "sportsart", "cardio", "bikes", "indent", ["hotel","condo","school"], true, false, 1.6],
  ["C572R Status Recumbent", "C572R", "sportsart", "cardio", "bikes", "indent", ["corp","gym"], false, false, 1.9],
  ["N685 Verde Elliptical", "N685", "sportsart", "cardio", "ellipticals", "available", ["gym","corp"], true, false, 2.1],
  ["T676 Treadmill", "T676", "intenza", "cardio", "treadmills", "indent", ["hotel","condo"], false, true, 2.2],
  ["550Ci Escalate Climber", "550CI", "intenza", "cardio", "steppers", "indent", ["gym","corp"], false, false, 1.7],
  ["E316 Upright Bike", "E316", "intenza", "cardio", "bikes", "available", ["condo","school"], false, false, 1.4],
  ["Newport AR Rower", "NEWPORT-AR", "firstdegree", "cardio", "rowers", "available", ["gym","corp","school"], false, true, 1.1],
  ["Fluid Rower E520", "E520", "firstdegree", "cardio", "rowers", "indent", ["hotel","condo"], false, false, 1.0],

  ["G20 Pro All-In-One Trainer", "G20-PRO", "forceusa", "functional", "allinone", "indent", ["condo","corp","gym"], false, true, 3.2],
  ["G12 All-In-One Trainer", "G12", "forceusa", "functional", "allinone", "available", ["condo","corp"], false, false, 2.8],
  ["MyRack Modular Power Rack", "MYRACK", "forceusa", "strength", "benches", "available", ["gym","school"], false, false, 2.6],
  ["F100 Folding Power Rack", "F100", "forceusa", "strength", "benches", "indent", ["condo","corp"], false, false, 1.9],
  ["IT9527 Leg Press", "IT9527", "impulse", "strength", "plateloaded", "indent", ["gym","school","lgu"], false, true, 1.5],
  ["IT9505 Chest Press", "IT9505", "impulse", "strength", "selectorized", "indent", ["hotel","corp","gym"], false, false, 1.4],
  ["IT9513 Lat Pulldown", "IT9513", "impulse", "strength", "selectorized", "available", ["corp","gym"], false, false, 1.4],
  ["IF8105 8-Station Multi Gym", "IF8105", "impulse", "strength", "multistation", "indent", ["school","lgu","condo"], false, true, 2.9],
  ["PL9010 Plate-Loaded Squat", "PL9010", "impulse", "strength", "plateloaded", "indent", ["gym"], false, false, 1.3],
  ["Olympic Bumper Set 150kg", "VF-BMP150", "versafit", "strength", "freeweights", "available", ["gym","corp"], false, false, 0.8],

  ["Elite Functional Rig 6-Bay", "VF-RIG6", "versafit", "functional", "rigs", "indent", ["gym","school"], false, true, 2.4],
  ["Storage & Accessory Wall", "VF-WALL", "versafit", "functional", "accessories", "available", ["gym","corp"], false, false, 1.2],
  ["SC3 Indoor Cycle", "SC3", "stages", "cycling", "cycles", "available", ["gym","hotel","corp"], false, true, 1.6],
  ["SB20 Smart Bike", "SB20", "stages", "cycling", "cycles", "indent", ["condo","corp"], false, false, 1.8],
  ["Stages Dash L50 Console", "DASH-L50", "stages", "cycling", "studio", "available", ["gym"], false, false, 0.9],
  ["Power Meter LR Gen 3", "SPM-LR3", "stages", "cycling", "powermeters", "available", ["gym"], false, false, 0.7],

  ["Interlocking Rubber Tile 20mm", "FP-T20", "fitplus", "flooring", "tiles", "available", ["gym","corp","school"], false, true, 1.1],
  ["Rubber Roll 8mm × 15m", "FP-R08", "fitplus", "flooring", "rolls", "available", ["hotel","condo","corp"], false, false, 1.0],
  ["Vinyl Sports Surface 4.5mm", "FP-V45", "fitplus", "flooring", "pvc", "indent", ["school","lgu"], false, false, 1.3],
  ["Olympic Lifting Platform", "FP-PLAT", "fitplus", "flooring", "platforms", "indent", ["gym","school"], false, false, 0.9],
  ["Court Surface System", "SA-COURT", "shamrock", "flooring", "pvc", "indent", ["school","lgu"], false, false, 1.4],

  ["Discovery Play System", "LE.QQ.114", "liben", "playground", "systems", "indent", ["lgu","school"], false, true, 3.6],
  ["Barangay Play Tower", "LE.QQ.208", "liben", "playground", "systems", "indent", ["lgu"], false, false, 3.1],
  ["Four-Seat Arch Swing", "LE.SW.041", "liben", "playground", "swings", "available", ["lgu","school"], false, false, 1.2],
  ["Spiral Tube Slide", "LE.SL.019", "liben", "playground", "slides", "indent", ["lgu","school"], false, false, 1.5],
  ["Spring Rider Duo", "LE.SR.007", "liben", "playground", "riders", "available", ["lgu"], false, false, 0.6],
];

const brandName = k => (BRANDS.find(b => b.key === k) || {}).name || k;
const catName = k => (CATEGORIES.find(c => c.key === k) || {}).name || k;
const subName = (ck, sk) => {
  const c = CATEGORIES.find(x => x.key === ck);
  const s = c && c.children.find(ch => ch[0] === sk);
  return s ? s[1] : sk;
};

export const PRODUCTS = P.map(([title, model, brand, cat, sub, avail, segs, eco, featured, mb]) => ({
  title, model, brand, cat, sub, avail, segs, eco, featured,
  brandName: brandName(brand),
  catName: catName(cat),
  subName: subName(cat, sub),
  slug: brand + "-" + model.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  specSize: mb.toFixed(1) + " MB",
  availLabel: AVAIL[avail].label,
  availColor: AVAIL[avail].color,
  availBorder: AVAIL[avail].border,
  lead: LEAD[avail] || "",
}));

// [title, client, displayAs, location, year, segment, brands, units, photos]
export const PROJECTS = [
  ["Corporate fitness centre, SM North EDSA", "SM Supermalls", "full", "Quezon City", 2025, "corp", ["sportsart","impulse","fitplus"], 42, true],
  ["Hotel gym refit, Shangri-La Plaza", "Shangri-La", "full", "Ortigas, Mandaluyong", 2025, "hotel", ["sportsart","intenza"], 18, true],
  ["Tower amenity gym, Uptown BGC", "Megaworld", "full", "Taguig", 2024, "condo", ["intenza","forceusa","fitplus"], 24, true],
  ["Head-office fitness floor", "Ayala Land", "full", "Makati", 2024, "corp", ["sportsart","versafit"], 31, false],
  ["Fitness centre, SM Seaside City", "SM Supermalls", "full", "Cebu City", 2024, "gym", ["impulse","stages","fitplus"], 56, true],
  ["Municipal playground programme", "City Government", "full", "Cagayan de Oro", 2023, "lgu", ["liben"], 6, true],
  ["Mall gym fit-out, Robinsons Place", "Robinsons Land", "full", "Iloilo City", 2023, "gym", ["impulse","versafit"], 38, false],
  ["Campus strength & conditioning hall", null, "anonymised", "Baguio City", 2023, "school", ["impulse","versafit","fitplus"], 44, false],
  ["Resort wellness pavilion", "Ayala Land", "full", "Morong, Bataan", 2022, "hotel", ["sportsart","firstdegree"], 14, true],
  ["Hotel gym, SM Lanang Premier", "SM Supermalls", "full", "Davao City", 2022, "hotel", ["intenza","forceusa"], 16, false],
  ["Executive fitness suite", null, "anonymised", "Bonifacio Global City, Taguig", 2022, "corp", ["sportsart"], 12, false],
  ["Barangay play & fitness park", "City Government", "full", "Antipolo, Rizal", 2021, "lgu", ["liben","shamrock"], 9, true],
].map(([title, client, displayAs, location, year, segment, brands, units, photos]) => ({
  title, client, displayAs, location, year, segment, brands, units, photos,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  clientLabel: displayAs === "full" ? client : "Client name withheld",
  segmentName: (SEGMENTS.find(s => s.key === segment) || {}).name || segment,
  brandNames: brands.map(brandName),
}));

