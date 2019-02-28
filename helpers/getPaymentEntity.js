const advCashHandler = (data) => {
  const { ac_amount } = data;
  const meta = Object.entries(data)
  .filter(item => item[0].indexOf('ac_') !== 0)
  .reduce((prev, item) => ({ ...prev, [item[0]]: item[1] }), {});
  return {
    amount: ac_amount,
    ...meta,
  };
};
const payeerHandler = (data) => {
  const { m_amount, m_orderid } = data;
  return {
    amount: m_amount,
    merchant: m_orderid.split('_')[0],
  };
};

export default ({ system, data }) => {
  switch (system) {
    case 'adv-cash':
      return advCashHandler(data);
    case 'payeer':
      return payeerHandler(data);
    default:
      throw new Error('Worong payment system name!');
  }
};