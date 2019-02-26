const advCashHandler = ({ ac_amount, merchant, meta }) => {
  return {
    amount: ac_amount,
    merchant,
    meta,
  };
};

export default ({ system, body }) => {
  switch (system) {
    case 'adv-cash':
      return advCashHandler(body);
    default:
      throw new Error('Worong payment system name!');
  }
};
