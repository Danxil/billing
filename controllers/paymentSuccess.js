const advCashHandler = (body) => {
  const { ac_amount } = body;
  const meta = Object.entries(body)
  .filter(item => item[0].indexOf('ac_') !== 0)
  .reduce((prev, item) => ({ ...prev, [item[0]]: item[1] }), {});
  return {
    amount: ac_amount,
    ...meta,
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
