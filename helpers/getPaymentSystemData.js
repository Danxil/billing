export default ({ paymentSystem, req }) => {
  switch (paymentSystem) {
    case 'adv-cash':
      return req.body;
    case 'payeer':
      return req.query;
    default:
      throw new Error('Wrong payment system name!');
  }
};
