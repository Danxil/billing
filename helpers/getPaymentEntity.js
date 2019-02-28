const advCashHandler = (data) => {
  const { ac_amount, ac_orderid } = data;
  const meta = Object.entries(data)
  .filter(item => item[0].indexOf('ac_') !== 0)
  .reduce((prev, item) => ({ ...prev, [item[0]]: item[1] }), {});
  return {
    amount: ac_amount,
    orderId: ac_orderid,
    ...meta,
  };
};
const payeerHandler = (data) => {
  console.log('info!!!!', data);
  const { m_amount, m_orderid, m_params } = data;
  const meta = JSON.parse(m_params);
  return {
    amount: m_amount,
    merchant: m_orderid.split('_')[0],
    orderId: m_orderid,
    ...meta.reference,
  };
};

export default ({ paymentSystem, data }) => {
  switch (paymentSystem) {
    case 'adv-cash':
      return advCashHandler(data);
    case 'payeer':
      return payeerHandler(data);
    default:
      throw new Error('Worong payment system name!');
  }
};
