import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = [
      'searchTerm',
      'search',
      'sort',
      'limit',
      'page',
      'fields',
      'filterBy', // Add this to exclude filterBy from direct filtering
    ];

    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.category) {
      queryObj.category = queryObj.category;
    }

    if (queryObj.status) {
      queryObj.status = queryObj.status;
    }

    // Handle date filtering for both createdAt and dateTime fields
    if (queryObj.startDate || queryObj.endDate) {
      const dateFilter: Record<string, unknown> = {};
      if (queryObj.startDate) {
        dateFilter.$gte = new Date(queryObj.startDate as string);
        delete queryObj.startDate;
      }
      if (queryObj.endDate) {
        dateFilter.$lte = new Date(queryObj.endDate as string);
        delete queryObj.endDate;
      }

      // Use dateTime for events, createdAt for other models
      // You can determine this based on the model or pass it as a parameter
      queryObj.dateTime = dateFilter; // For events
      // queryObj.createdAt = dateFilter; // For other models
    }

    if (queryObj.minPoints || queryObj.maxPoints) {
      const pointsFilter: Record<string, unknown> = {};
      if (queryObj.minPoints) {
        pointsFilter.$gte = Number(queryObj.minPoints);
        delete queryObj.minPoints;
      }
      if (queryObj.maxPoints) {
        pointsFilter.$lte = Number(queryObj.maxPoints);
        delete queryObj.maxPoints;
      }
      queryObj.points = pointsFilter;
    }

    if (queryObj.userId) {
      queryObj.userId = queryObj.userId;
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
