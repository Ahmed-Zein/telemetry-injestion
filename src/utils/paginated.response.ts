export class PaginatedResult<T> {
  data: T[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;

  constructor(
    data: T[],
    totalPages: number,
    pageNumber: number,
    pageSize: number,
  ) {
    this.data = data;
    this.totalPages = totalPages;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.hasNext = this.pageNumber < this.totalPages;
    this.hasPrevious = this.pageNumber > 1;
  }
}
