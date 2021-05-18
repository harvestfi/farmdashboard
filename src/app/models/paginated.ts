export class Paginated<T> {
  currentPage: number;
  nextPage: number;
  previousPage: number;
  totalPages: number;
  data: T[];

  public static empty<K>(): Paginated<K> {
    return {
      currentPage: 0,
      nextPage: -1,
      previousPage: -1,
      totalPages: 0,
      data: []
    };
  }
}
