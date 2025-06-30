import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { TCreateEvent, TUpdateEvent, TEventQuery } from './event.interface';
import { Event } from './event.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createEvent = async (payload: TCreateEvent) => {
  const result = await Event.create(payload);
  return result;
};

const getAllEvents = async (query: TEventQuery) => {
  // Create a modified query object for date filtering
  const modifiedQuery = { ...query };

  // Handle filterBy parameter by converting to startDate/endDate
  if (query.filterBy) {
    const now = new Date();
    let startDate: string;
    let endDate: string;

    switch (query.filterBy) {
      case 'today':
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        const todayEnd = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
        );
        startDate = todayStart.toISOString();
        endDate = todayEnd.toISOString();
        break;
      case 'current-week':
        const currentWeekStart = new Date(now);
        currentWeekStart.setDate(now.getDate() - now.getDay());
        currentWeekStart.setHours(0, 0, 0, 0);
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 7);
        startDate = currentWeekStart.toISOString();
        endDate = currentWeekEnd.toISOString();
        break;
      case 'last-week':
        const lastWeekStart = new Date(now);
        lastWeekStart.setDate(now.getDate() - now.getDay() - 7);
        lastWeekStart.setHours(0, 0, 0, 0);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 7);
        startDate = lastWeekStart.toISOString();
        endDate = lastWeekEnd.toISOString();
        break;
      case 'current-month':
        const currentMonthStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
        );
        const currentMonthEnd = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          1,
        );
        startDate = currentMonthStart.toISOString();
        endDate = currentMonthEnd.toISOString();
        break;
      case 'last-month':
        const lastMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = lastMonthStart.toISOString();
        endDate = lastMonthEnd.toISOString();
        break;
      default:
        startDate = new Date(0).toISOString();
        endDate = new Date().toISOString();
    }

    // Add date range to query and remove filterBy
    modifiedQuery.startDate = startDate;
    modifiedQuery.endDate = endDate;
    delete modifiedQuery.filterBy;
  }

  // Set default sort if not provided
  if (!modifiedQuery.sort) {
    modifiedQuery.sort = '-dateTime';
  }

  const eventQuery = new QueryBuilder(Event.find(), modifiedQuery)
    .search(['title', 'description', 'location'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate({
      path: 'createdBy',
      select: 'name email photoUrl',
    });

  const result = await eventQuery.modelQuery;
  const meta = await eventQuery.countTotal();

  return {
    result,
    meta,
  };
};

const getSingleEvent = async (eventId: string) => {
  if (!Types.ObjectId.isValid(eventId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid event ID');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Event not found');
  }

  return event;
};

const updateEvent = async (
  eventId: string,
  userId: string,
  payload: TUpdateEvent,
) => {
  if (!Types.ObjectId.isValid(eventId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid event ID');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Event not found');
  }

  // Check if the user is the creator of the event
  if (event.createdBy.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to update this event',
    );
  }

  const updatedEvent = await Event.findByIdAndUpdate(eventId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedEvent;
};

const deleteEvent = async (eventId: string, userId: string) => {
  if (!Types.ObjectId.isValid(eventId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid event ID');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Event not found');
  }

  // Check if the user is the creator of the event
  if (event.createdBy.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to delete this event',
    );
  }

  await Event.findByIdAndDelete(eventId);
  return event;
};

const joinEvent = async (eventId: string, userId: string) => {
  if (!Types.ObjectId.isValid(eventId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid event ID');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Event not found');
  }

  // Check if user already joined the event
  const isAlreadyJoined = await Event.isUserAlreadyJoined(eventId, userId);
  if (isAlreadyJoined) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'You have already joined this event',
    );
  }

  // Add user to attendees and increment attendeeCount
  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    {
      $addToSet: { attendees: userId },
      $inc: { attendeeCount: 1 },
    },
    { new: true },
  );

  return updatedEvent;
};

const getMyEvents = async (userId: string, query: TEventQuery) => {
  // Add createdBy filter to query
  const modifiedQuery = { ...query, userId };

  // Set default sort if not provided
  if (!modifiedQuery.sort) {
    modifiedQuery.sort = '-dateTime';
  }

  const eventQuery = new QueryBuilder(
    Event.find({ createdBy: userId }),
    modifiedQuery,
  )
    .search(['title', 'description', 'location'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate({
      path: 'createdBy',
      select: 'name email photoUrl',
    });

  const result = await eventQuery.modelQuery;
  const meta = await eventQuery.countTotal();

  return {
    result,
    meta,
  };
};

const getJoinedEvents = async (userId: string, query: TEventQuery) => {
  // Set default sort if not provided
  const modifiedQuery = { ...query };
  if (!modifiedQuery.sort) {
    modifiedQuery.sort = '-dateTime';
  }

  const eventQuery = new QueryBuilder(
    Event.find({ attendees: { $in: [userId] } }),
    modifiedQuery,
  )
    .search(['title', 'description', 'location'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .populate({
      path: 'createdBy',
      select: 'name email photoUrl',
    });

  const result = await eventQuery.modelQuery;
  const meta = await eventQuery.countTotal();

  return {
    result,
    meta,
  };
};

export const EventServices = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  getMyEvents,
  getJoinedEvents,
};
