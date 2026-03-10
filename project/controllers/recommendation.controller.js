import { getRecommendedTreks } from "../services/recommendation.service.js";

export const recommendTreks = async (req, res) => {
  try {
    const userId = req.params.userId;

    const treks = await getRecommendedTreks(userId);

    res.json({
      success: true,
      recommendations: treks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
