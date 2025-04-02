import { seoRequests, type SeoRequest, type InsertSeoRequest } from "@shared/schema";

export interface IStorage {
  saveRequest(request: InsertSeoRequest): Promise<SeoRequest>;
  getRequestsByUrl(url: string): Promise<SeoRequest[]>;
  getAllRequests(): Promise<SeoRequest[]>;
}

export class MemStorage implements IStorage {
  private requests: Map<number, SeoRequest>;
  currentId: number;

  constructor() {
    this.requests = new Map();
    this.currentId = 1;
  }

  async saveRequest(insertRequest: InsertSeoRequest): Promise<SeoRequest> {
    const id = this.currentId++;
    const request: SeoRequest = { ...insertRequest, id };
    this.requests.set(id, request);
    return request;
  }

  async getRequestsByUrl(url: string): Promise<SeoRequest[]> {
    return Array.from(this.requests.values()).filter(
      (request) => request.url === url
    );
  }

  async getAllRequests(): Promise<SeoRequest[]> {
    return Array.from(this.requests.values());
  }
}

export const storage = new MemStorage();
