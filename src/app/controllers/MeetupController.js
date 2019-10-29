import * as Yup from 'yup';
import { parseISO, isBefore, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';

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

  async index(req, res) {
    const seachDate = parseISO(req.query.date);
    const { page = 1 } = req.query;
    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(seachDate), endOfDay(seachDate)],
        },
      },
      order: ['date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json(meetups);
    // const where = {};
    // const page = req.query.page || 1;
    // if (req.query.date) {
    //   const searchDate = parseISO(req.query.date);
    //   where.date = {
    //     [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
    //   };
    // }
    // const meetups = await Meetup.findAll({
    //   where,
    //   include: [
    //     {
    //       model: User,
    //       attributes: ['name', 'email'],
    //     },
    //   ],
    //   order: ['date'],
    //   limit: 10,
    //   offset: 10 * page - 10,
    // });
    // return res.json(meetups);
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

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exists' });
    }
    if (meetup.user_id !== req.userId) {
      return res.status(401).json({ error: ' Not authorized' });
    }
    if (meetup.past) {
      return res.status(401).json({ error: " Can'nt delete past meetups" });
    }

    await meetup.destroy();
    return res.json({ sucess: 'Meetup deleted' });
  }
}

export default new MeetupController();
