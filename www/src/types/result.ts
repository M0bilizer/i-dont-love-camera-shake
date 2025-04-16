import CustomError from "./errors";

class Result {
    private errors: CustomError[];
  
    constructor(errors: CustomError[] = []) {
      this.errors = errors;
    }

    hasErrors(): boolean {
      return this.errors.length > 0;
    }

    getErrors(): CustomError[] {
      return this.errors;
    }
}

class ValidationResult extends Result {
  constructor(errors: CustomError[] = []) {
    super(errors);
  }

  isSuccess(): boolean {
    return !this.hasErrors();
  }
}

class DataResult<T> extends Result {
  private data: T | null;

  constructor(data: T | null = null, errors: CustomError[] = []) {
    super(errors);
    this.data = data;
  }

  isSuccess(): boolean {
    return !this.hasErrors();
  }


  getData(): T {
    return this.data!
  }
}

export { ValidationResult, DataResult }
  