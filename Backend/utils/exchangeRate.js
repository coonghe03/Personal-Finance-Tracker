import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const FASTFOREX_API_KEY = process.env.FASTFOREX_API_KEY;
const BASE_URL = "https://api.fastforex.io/fetch-one?";

export const getExchangeRate = async (base, target) => {
  try {
    const response = await axios.get(
      `${BASE_URL}from=${base}&to=${target}&api_key=${FASTFOREX_API_KEY}`
    );
    console.log(response.data);

    if (response.data && response.data.result) {
      return response.data.result[target];
    }
    throw new Error("Invalid response from API");
  } catch (error) {
    console.log("Error fetching exchange rate:", error);
    return null;
  }
};