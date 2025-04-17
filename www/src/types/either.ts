class Either<T, E> {
  private constructor(private isSuccess: boolean, private value: T | E) {}

  static success<T, E>(value: T): Either<T, E> {
    return new Either<T, E>(true, value);
  }

  static failure<T, E>(error: E): Either<T, E> {
    return new Either<T, E>(false, error);
  }

  onSuccess(callback: (value: T) => void): this {
    if (this.isSuccess) {
      callback(this.value as T);
    }
    return this;
  }

  onFailure(callback: (error: E) => void): this {
    if (!this.isSuccess) {
      callback(this.value as E);
    }
    return this;
  }
}

export default Either;