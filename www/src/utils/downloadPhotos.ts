import { Either, failure, success } from "../types/either";
import CustomError, { PollingError } from "../types/errors";

const downloadImage = async (
  url: string,
  fileName?: string,
): Promise<Either<string, CustomError>> => {
  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
    });

    if (!response.ok) {
      return failure(
        new CustomError(`Server responded with status ${response.status}`),
      );
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const downloadName = fileName || url.split("/").pop() || "download";
    link.href = objectUrl;
    link.download = downloadName;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    }, 100);

    return success(downloadName);
  } catch (error) {
    return failure(new CustomError(`Failed to download image: ${error}`));
  }
};

const checkImageAvailability = async (
  url: string,
  baseDelay = 1000,
  maxAttempts = 20,
  maxDelay = 10000,
  initialDelay = 3000,
): Promise<Either<true, CustomError>> => {
  let attempts = 0;

  const check = async (): Promise<Either<true, CustomError>> => {
    // Apply initial delay only on first attempt
    if (attempts === 0 && initialDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, initialDelay));
    }

    try {
      attempts++;
      const response = await fetch(url, {
        method: "HEAD",
        mode: "cors",
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        return success(true as const);
      }

      if (attempts >= maxAttempts) {
        return failure(
          new PollingError(
            `Failed after ${maxAttempts} attempts (last status: ${response.status})`,
          ),
        );
      }

      const delay = calculateDelay(attempts, baseDelay, maxDelay);
      console.log(
        `Attempt ${attempts}/${maxAttempts} - retrying in ${Math.round(delay / 1000)}s...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return check();
    } catch (error) {
      if (attempts >= maxAttempts) {
        return failure(
          new PollingError(
            `Persistent network errors after ${maxAttempts} attempts`,
          ),
        );
      }

      const delay = calculateDelay(attempts, baseDelay, maxDelay);
      console.error(
        `Check failed (attempt ${attempts}), retrying in ${Math.round(delay / 1000)}s:`,
        error instanceof Error ? error.message : error,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return check();
    }
  };

  return check();
};

/*
 * █░█ █▀▀ █░░ █▀█ █▀▀ █▀█   █▀▀ █░█ █▄░█ █▀▀ ▀█▀ █ █▀█ █▄░█ █▀
 * █▀█ ██▄ █▄▄ █▀▀ ██▄ █▀▄   █▀░ █▄█ █░▀█ █▄▄ ░█░ █ █▄█ █░▀█ ▄█
 **/

const calculateDelay = (
  attempt: number,
  baseDelay: number,
  maxDelay: number,
) => {
  const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
  return delay * 0.5 + Math.random() * delay * 0.5;
};

export { downloadImage, checkImageAvailability };
