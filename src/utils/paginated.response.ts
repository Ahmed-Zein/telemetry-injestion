// cypod-telemetry

export class PaginatedResult<T> {
  items: T[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;

  constructor(
    items: T[],
    totalPages: number,
    pageNumber: number,
    pageSize: number,
  ) {
    this.items = items;
    this.totalPages = totalPages;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.hasNext = this.pageNumber < this.totalPages;
    this.hasPrevious = this.pageNumber > 1;
  }
}
