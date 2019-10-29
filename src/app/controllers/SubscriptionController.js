import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: { model: User },
    });

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exists' });
    }

    if (meetup.user_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot subscribe for your own meetup' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: 'Meetup alredy past' });
    }

    const dateCheck = await Subscription.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          where: { date: meetup.date },
        },
      ],
    });

    if (dateCheck) {
      return res
        .status(401)
        .json({ error: 'You already have a meetup scheduled at this time' });
    }

    const subscribe = await Subscription.create({
      meetup_id: meetup.id,
      user_id: req.userId,
    });

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscribe);
  }

  async index(req, res) {
    const meetups = await Subscription.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(meetups);
  }
}

export default new SubscriptionController();
