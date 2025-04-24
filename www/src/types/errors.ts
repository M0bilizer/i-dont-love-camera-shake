export default class CustomError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class PollingError extends CustomError {
  constructor(message: string) {
    console.log(message);
    super("Could not process image");
  }
}
