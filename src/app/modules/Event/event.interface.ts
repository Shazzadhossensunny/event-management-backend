import { Document, Types } from 'mongoose';

export type TCreateEvent = {
  title: string;
  name: string;
  dateTime: Date;
  location: string;
  description: string;
  attendeeCount?: number;
  createdBy: string;
};

export type TUpdateEvent = {
  title?: string;
  name?: string;
  dateTime?: Date;
  location?: string;
  description?: string;
};

export type TEventQuery = {
  search?: string;
  filterBy?:
    | 'today'
    | 'current-week'
    | 'last-week'
    | 'current-month'
    | 'last-month';
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  name: string;
  dateTime: Date;
  location: string;
  description: string;
  attendeeCount: number;
  createdBy: Types.ObjectId;
  attendees: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventModel extends Document {
  isUserAlreadyJoined(eventId: string, userId: string): Promise<boolean>;
}
