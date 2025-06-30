import { Schema, model, Model } from 'mongoose';
import { IEvent, IEventModel } from './event.interface';

// Create interface for Event model
type EventModelType = Model<IEvent, {}> & IEventModel;

const eventSchema = new Schema<IEvent, EventModelType>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Event title cannot exceed 100 characters'],
    },
    name: {
      type: String,
      required: [true, 'Event organizer name is required'],
      trim: true,
      maxlength: [50, 'Organizer name cannot exceed 50 characters'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Event date and time is required'],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: 'Event date and time must be in the future',
      },
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    attendeeCount: {
      type: Number,
      default: 0,
      min: [0, 'Attendee count cannot be negative'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event creator is required'],
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
eventSchema.index({ dateTime: -1 });
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ createdBy: 1 });

// Static methods
eventSchema.statics.isUserAlreadyJoined = async function (
  eventId: string,
  userId: string,
) {
  const event = await this.findById(eventId);
  if (!event) return false;

  return event.attendees.includes(userId);
};

// Pre-populate middleware for getting events with creator info
eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: 'name email photoUrl',
  });
  next();
});

export const Event = model<IEvent, EventModelType>('Event', eventSchema);
