import Bee from 'bee-queue';

import redisConfig from '../config/redis';

import SubscriptionMail from '../app/jobs/SubscriptionMail';

const jobs = [SubscriptionMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        queueBee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].queueBee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { queueBee, handle } = this.queues[job.key];

      queueBee.process(handle);
    });
  }
}
export default new Queue();
