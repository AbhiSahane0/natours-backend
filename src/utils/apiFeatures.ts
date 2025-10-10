import { Document, Query } from 'mongoose'

export const applyFilter = <T extends Document>(
    query: Query<any, T>,
    queryParams: Record<string, any>
) => {
    const filterObj = { ...queryParams }
    ;['page', 'sort', 'limit', 'fields'].forEach((k) => delete filterObj[k])

    const queryStr = JSON.stringify(filterObj).replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
    )

    return query.find(JSON.parse(queryStr)).select('-__v')
}

export const applySort = <T extends Document>(
    query: Query<any, T>,
    sortParam?: string
) => {
    if (!sortParam) return query.sort('-createdAt')
    const sortBy = sortParam.split(',').join(' ')
    return query.sort(sortBy)
}

export const applyFields = <T extends Document>(
    query: Query<any, T>,
    fields?: string
) => {
    if (!fields) return query
    const selectFields = fields.split(',').join(' ')
    return query.select(selectFields)
}

export const applyPagination = <T extends Document>(
    query: Query<any, T>,
    pageParam?: string,
    limitParam?: string
) => {
    const page = Number(pageParam) || 1
    const limit = Number(limitParam) || 100
    const skip = (page - 1) * limit
    return query.skip(skip).limit(limit)
}
