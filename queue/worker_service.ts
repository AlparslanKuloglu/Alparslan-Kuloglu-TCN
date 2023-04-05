import { Process, Processor } from '@nestjs/bull';

@Processor('order')
export class WorkerService {
  @Process()
  async processMyQueue() {
    // Kuyruktan işleri al ve işle
  }
}