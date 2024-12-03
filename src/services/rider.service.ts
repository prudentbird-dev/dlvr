import Rider from "../models/rider.model";
import { IRider } from "../types/rider.type";

export const riderService = {
  async createRider(riderData: Partial<IRider>): Promise<IRider> {
    const rider = new Rider(riderData);
    await rider.save();
    return rider;
  },

  async getRiders(): Promise<IRider[]> {
    return Rider.find({});
  },

  async getRiderById(id: string): Promise<IRider | null> {
    return Rider.findById(id);
  },

  async updateRider(
    id: string,
    updateData: Partial<IRider>,
  ): Promise<IRider | null> {
    return Rider.findByIdAndUpdate(id, updateData, { new: true });
  },

  async deleteRider(id: string): Promise<IRider | null> {
    return Rider.findByIdAndDelete(id);
  },

  async getNearestAvailableRider(location: number[]): Promise<IRider | null> {
    return Rider.findOne({
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: location,
          },
        },
      },
    });
  },
};
