export default ({ paymentSystem, req: { body, query, method } }) => {
  switch (paymentSystem) {
    case 'adv-cash':
    case 'payeer':
    case 'coin-payments':
    case 'perfect-money':
      return method === 'GET' ? query : body;
    default:
      throw new Error('Wrong payment system name!');
  }
};
