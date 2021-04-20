export class Paginated<T> {
  currentPage: number;
  nextPage: number;
  previousPage: number;
  totalPages: number;
  data: T[];
}
