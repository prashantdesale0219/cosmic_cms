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
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'q', 'direction'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering with operators ($gt, $gte, etc.)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Search functionality
  search() {
    if ((this.queryString.search && this.queryString.search.trim()) || (this.queryString.q && this.queryString.q.trim())) {
      const searchTerm = this.queryString.search || this.queryString.q;
      // Use regex search instead of text search for better compatibility
      this.query = this.query.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { position: { $regex: searchTerm, $options: 'i' } },
          { department: { $regex: searchTerm, $options: 'i' } },
          { bio: { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }
    return this;
  }

  // Sort results
  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(',').join(' ');
      
      // Handle direction parameter
      if (this.queryString.direction === 'desc') {
        sortBy = sortBy.split(' ').map(field => field.startsWith('-') ? field : `-${field}`).join(' ');
      } else if (this.queryString.direction === 'asc') {
        sortBy = sortBy.split(' ').map(field => field.startsWith('-') ? field.substring(1) : field).join(' ');
      }
      
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