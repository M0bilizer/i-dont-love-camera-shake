import { Either, failure, success } from "../types/either";
import CustomError from "../types/errors";

const checkImageAvailability = async (
  url: string,
  interval = 5000,
  maxAttempts = 20,
): Promise<Either<true, CustomError>> => {
  let attempts = 0;

  const check = async (): Promise<Either<true, CustomError>> => {
    try {
      attempts++;
      const response = await fetch(url, {
        method: "HEAD",
        mode: "cors",
        cache: "no-store",
      });

      if (response.ok) {
        return success(true);
      }

      if (attempts >= maxAttempts) {
        return failure(
          new CustomError("Maximum attempts reached - image unavailable"),
        );
      }

      console.log(`Attempt ${attempts}/${maxAttempts} - retrying...`);
      await new Promise((resolve) => setTimeout(resolve, interval));
      return check();
    } catch (error) {
      console.error(`Check failed (attempt ${attempts}):`, error);
      if (attempts >= maxAttempts) {
        return failure(
          new CustomError("Maximum attempts reached after network errors"),
        );
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      return check();
    }
  };

  return check();
};

export default checkImageAvailability;
