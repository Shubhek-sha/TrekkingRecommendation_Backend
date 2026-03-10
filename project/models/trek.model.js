import db from "../config/db.js";

// Get all treks
export const getAllTreks = async () => {
  const [rows] = await db.query("SELECT * FROM treks WHERE is_active = TRUE");

  return rows;
};

// Get trek by id
export const getTrekById = async (id) => {
  const [rows] = await db.query("SELECT * FROM treks WHERE trek_id=?", [id]);

  return rows[0];
};

// Create trek
export const createTrek = async (trek) => {
  const query = `
  INSERT INTO treks(
    name,
    slug,
    location,
    region,
    country,
    difficulty,
    duration_days,
    distance_km,
    max_altitude,
    altitude_gain,
    starting_point,
    ending_point,
    daily_trek_hours,
    temperature_range,
    permits_required,
    guide_mandatory,
    fitness_level_required,
    water_availability,
    food_availability,
    mobile_network_availability,
    risk_level,
    altitude_sickness_risk,
    nearest_medical_facility_distance,
    evacuation_possible,
    cost_min_usd,
    cost_max_usd,
    cultural_significance,
    group_size_min,
    group_size_max,
    popularity_score,
    is_active
  )
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  // Convert values to match database schema
  const values = [
    trek.name,
    trek.slug,
    trek.location,
    trek.region,
    trek.country,
    trek.difficulty,
    trek.duration_days,
    trek.distance_km,
    trek.max_altitude,
    trek.altitude_gain,
    trek.starting_point,
    trek.ending_point,
    trek.daily_trek_hours,
    trek.temperature_range,
    trek.permits_required === true || trek.permits_required === "true"
      ? "Yes"
      : "No", // text field
    trek.guide_mandatory === true || trek.guide_mandatory === "true" ? 1 : 0,
    trek.fitness_level_required,
    trek.water_availability === true || trek.water_availability === "true"
      ? 1
      : 0,
    trek.food_availability === true || trek.food_availability === "true"
      ? 1
      : 0,
    trek.mobile_network_availability === true ||
    trek.mobile_network_availability === "true"
      ? 1
      : 0,
    trek.risk_level,
    trek.altitude_sickness_risk === true ||
    trek.altitude_sickness_risk === "true" ||
    trek.altitude_sickness_risk === "high"
      ? "high"
      : "low", // enum field
    trek.nearest_medical_facility_distance,
    trek.evacuation_possible === true || trek.evacuation_possible === "true"
      ? 1
      : 0,
    trek.cost_min_usd,
    trek.cost_max_usd,
    trek.cultural_significance,
    trek.group_size_min,
    trek.group_size_max,
    trek.popularity_score,
    trek.is_active === true || trek.is_active === "true" ? 1 : 0,
  ];

  const [result] = await db.query(query, values);

  return result;
};
