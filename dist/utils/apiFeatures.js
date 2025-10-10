export const applyFilter = (query, queryParams) => {
    const filterObj = { ...queryParams };
    ['page', 'sort', 'limit', 'fields'].forEach((k) => delete filterObj[k]);
    const queryStr = JSON.stringify(filterObj).replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    return query.find(JSON.parse(queryStr)).select('-__v');
};
export const applySort = (query, sortParam) => {
    if (!sortParam)
        return query.sort('-createdAt');
    const sortBy = sortParam.split(',').join(' ');
    return query.sort(sortBy);
};
export const applyFields = (query, fields) => {
    if (!fields)
        return query;
    const selectFields = fields.split(',').join(' ');
    return query.select(selectFields);
};
export const applyPagination = (query, pageParam, limitParam) => {
    const page = Number(pageParam) || 1;
    const limit = Number(limitParam) || 100;
    const skip = (page - 1) * limit;
    return query.skip(skip).limit(limit);
};
//# sourceMappingURL=apiFeatures.js.map