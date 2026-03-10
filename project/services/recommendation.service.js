import db from "../config/db.js";

export const getRecommendedTreks = async (userId) => {
  try {
    // 1️⃣ Get user preferences
    const [userRows] = await db.query(
      `SELECT 
        fitness_level,
        preferred_difficulty,
        preferred_max_duration
       FROM users
       WHERE user_id = ?`,
      [userId],
    );

    const user = userRows[0];

    if (!user) {
      throw new Error("User not found");
    }

    // 2️⃣ Get matching treks
    const [treks] = await db.query(
      `
      SELECT *
      FROM treks
      WHERE difficulty = ?
      AND duration_days <= ?
      AND fitness_level_required <= ?
      ORDER BY popularity_score DESC
      LIMIT 5
      `,
      [
        user.preferred_difficulty,
        user.preferred_max_duration,
        user.fitness_level,
      ],
    );

    return treks;
  } catch (error) {
    throw error;
  }
};
