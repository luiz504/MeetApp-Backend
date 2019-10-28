import { parseISO, format } from 'date-fns';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: ` ${meetup.title} - New subscriber`,
      template: 'Subscription',
      context: {
        organizer: meetup.User.name,
        title: meetup.title,
        date: format(parseISO(meetup.date), "yyyy/MM do 'at' HH:mm/'h' "),
        subscriber: user.name,
        subMail: user.email,
      },
    });
  }
}

export default new SubscriptionMail();
