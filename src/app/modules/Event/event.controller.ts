import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EventServices } from './event.service';

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId!;
  const eventData = {
    ...req.body,
    createdBy: userId,
    dateTime: new Date(req.body.dateTime),
  };

  const result = await EventServices.createEvent(eventData);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Event created successfully!',
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventServices.getAllEvents(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Events retrieved successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const result = await EventServices.getSingleEvent(eventId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Event retrieved successfully!',
    data: result,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const userId = req.user?.userId!;

  // Convert dateTime to Date object if provided
  if (req.body.dateTime) {
    req.body.dateTime = new Date(req.body.dateTime);
  }

  const result = await EventServices.updateEvent(eventId, userId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Event updated successfully!',
    data: result,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const userId = req.user?.userId!;

  await EventServices.deleteEvent(eventId, userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Event deleted successfully!',
    data: null,
  });
});

const joinEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const userId = req.user?.userId!;

  const result = await EventServices.joinEvent(eventId, userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Successfully joined the event!',
    data: result,
  });
});

const getMyEvents = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId!;
  const result = await EventServices.getMyEvents(userId, req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'My events retrieved successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const getJoinedEvents = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId!;
  const result = await EventServices.getJoinedEvents(userId, req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Joined events retrieved successfully!',
    meta: result.meta,
    data: result.result,
  });
});

export const EventControllers = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  getMyEvents,
  getJoinedEvents,
};
