import { Either, failure, success } from "../types/either";
import CustomError from "../types/errors";

const checkImageAvailability = async (
  url: string,
  baseDelay = 1000, 
  maxAttempts = 20,
  maxDelay = 10000 
): Promise<Either<true, CustomError>> => {
  let attempts = 0;

  const calculateDelay = (attempt: number) => {
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    return delay * 0.5 + Math.random() * delay * 0.5;
  };

  const check = async (): Promise<Either<true, CustomError>> => {
    try {
      attempts++;
      const response = await fetch(url, {
        method: "HEAD",
        mode: "cors",
        cache: "no-store",
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        return success(true as const);
      }

      if (attempts >= maxAttempts) {
        return failure(
          new CustomError(
            `Failed after ${maxAttempts} attempts (last status: ${response.status})`
          )
        );
      }

      const delay = calculateDelay(attempts);
      console.log(`Attempt ${attempts}/${maxAttempts} - retrying in ${Math.round(delay / 1000)}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return check();
    } catch (error) {
      if (attempts >= maxAttempts) {
        return failure(
          new CustomError(
            `Persistent network errors after ${maxAttempts} attempts`
          )
        );
      }

      const delay = calculateDelay(attempts);
      console.error(`Check failed (attempt ${attempts}), retrying in ${Math.round(delay / 1000)}s:`, error instanceof Error ? error.message : error);
      await new Promise(resolve => setTimeout(resolve, delay));
      return check();
    }
  };

  return check();
};

export default checkImageAvailability;