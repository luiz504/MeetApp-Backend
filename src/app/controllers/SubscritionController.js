import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';

class SubscriptionController {
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: { model: User },
    });
    // meetup exist
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exists' });
    }

    // subscriber !== organiazer
    if (meetup.user_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot subscribe your own meetup' });
    }
    // meetup past
    if (meetup.past) {
      return res.status(400).json({ error: 'Meetup alredy past' });
    }
    // user alredy sub at same time
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

    return res.json(subscribe);
  }
}

export default new SubscriptionController();
