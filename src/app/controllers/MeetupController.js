import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';

import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const Schema = Yup.object().shape({
      banner_id: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await Schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(401).json({ error: 'Date already past' });
    }
    const user_id = req.userId;

    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });
    /**
     * validation meetup interval
     *  */
    return res.json(meetup);
  }

  async update(req, res) {
    const Schema = Yup.object().shape({
      banner_id: Yup.number(),
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await Schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const meetup = await Meetup.findByPk(req.params.meetupId);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetups does not exists' });
    }

    if (req.userId !== meetup.user_id) {
      return res
        .status(401)
        .json({ error: ' Only the event organizer can edit' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: ' Meetup alredy past' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(401).json({ error: 'Informed date alredy past' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }
}

export default new MeetupController();
