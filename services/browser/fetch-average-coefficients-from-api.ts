import { TIndustry } from "@/types/industry";

export async function fetchAverageCoefficientsFromAPI(industry: TIndustry): Promise<number | null> {
  try {
    const response = await fetch(`${window.location.origin}/api/average-coefficients?industry=${industry}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error while fetching average coefficients', error);
  }

  return null;
}
