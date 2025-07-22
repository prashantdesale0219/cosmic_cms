import config from '../config/config.js';

// API Features class for filtering, sorting, pagination, etc.
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Filter results based on query parameters
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'q'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering with operators ($gt, $gte, etc.)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Search functionality
  search() {
    if (this.queryString.search || this.queryString.q) {
      const searchTerm = this.queryString.search || this.queryString.q;
      this.query = this.query.find({ $text: { $search: searchTerm } });
    }
    return this;
  }

  // Sort results
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort by createdAt in descending order
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // Limit fields in response
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Exclude __v field by default
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // Pagination
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    let limit = parseInt(this.queryString.limit, 10) || config.defaultPageSize;
    
    // Ensure limit doesn't exceed maxPageSize
    if (limit > config.maxPageSize) {
      limit = config.maxPageSize;
    }
    
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit, skip };

    return this;
  }
}

export default APIFeatures;