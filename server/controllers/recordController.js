const Record = require('../models/Record');
const { PAGINATION } = require('../config/constants');

/**
 * GET /api/records
 * List verification records with pagination, filtering, sorting, and search.
 */
const getRecords = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(1, parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT)
    );
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.company) filter.company = req.query.company;
    if (req.query.verificationType) filter.verificationType = req.query.verificationType;
    if (req.query.accessLevel) filter.accessLevel = req.query.accessLevel;
    if (req.query.search) {
      filter.$or = [
        { employeeName: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Build sort
    const sortField = req.query.sortBy || 'submittedDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [records, total] = await Promise.all([
      Record.find(filter).sort(sort).skip(skip).limit(limit),
      Record.countDocuments(filter),
    ]);

    // Aggregate stats
    const stats = await Record.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      total: await Record.countDocuments(),
      pending: 0,
      verified: 0,
      rejected: 0,
    };
    stats.forEach((s) => {
      statusCounts[s._id.toLowerCase()] = s.count;
    });

    res.status(200).json({
      success: true,
      data: records,
      stats: statusCounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/records/stats
 * Get verification record statistics for dashboard.
 */
const getRecordStats = async (req, res, next) => {
  try {
    const [statusStats, companyStats, typeStats, recentRecords] = await Promise.all([
      Record.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Record.aggregate([
        { $group: { _id: '$company', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Record.aggregate([
        { $group: { _id: '$verificationType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Record.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const total = await Record.countDocuments();
    const statusCounts = { pending: 0, verified: 0, rejected: 0 };
    statusStats.forEach((s) => {
      statusCounts[s._id.toLowerCase()] = s.count;
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        ...statusCounts,
        byCompany: companyStats,
        byType: typeStats,
        recentActivity: recentRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecords, getRecordStats };
