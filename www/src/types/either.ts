type Success<T> = {
  type: "success";
  value: T;
  isSuccess(): this is Success<T>;
  isFailure(): this is never;
};

type Failure<E> = {
  type: "failure";
  error: E;
  isSuccess(): this is never;
  isFailure(): this is Failure<E>;
};

type Either<T, E> = Success<T> | Failure<E>;

const success = <T, E>(value: T): Either<T, E> => ({
  type: "success",
  value,
  isSuccess(): this is Success<T> {
    return true;
  },
  isFailure(): this is never {
    return false;
  },
});

const failure = <T, E>(error: E): Either<T, E> => ({
  type: "failure",
  error,
  isSuccess(): this is never {
    return false;
  },
  isFailure(): this is Failure<E> {
    return true;
  },
});

const match = <T, E, R>(
  either: Either<T, E>,
  onSuccess: (value: T) => R,
  onFailure: (error: E) => R,
): R => {
  switch (either.type) {
    case "success":
      return onSuccess(either.value);
    case "failure":
      return onFailure(either.error);
  }
};

export type { Either };
export { success, failure, match };
