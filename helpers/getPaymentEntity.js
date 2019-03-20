const advCashHandler = (data) => {
  const { ac_amount, ac_order_id } = data;
  const meta = Object.entries(data)
  .filter(item => item[0].indexOf('ac_') !== 0)
  .reduce((prev, item) => ({ ...prev, [item[0]]: item[1] }), {});
  return {
    amount: ac_amount,
    orderId: ac_order_id,
    ...meta,
  };
};
const payeerHandler = (data) => {
  const { m_amount, m_orderid, m_params: mParams } = data;
  const meta = mParams ? JSON.parse(mParams).reference : { reference: {} };
  return {
    amount: m_amount,
    merchant: m_orderid.split('_')[0],
    orderId: m_orderid,
    ...meta,
  };
};
const coinPaymentsHandler = (data) => {
  const { amount1, invoice, custom } = data;
  const meta = JSON.parse(custom);
  if (data.status >= 100) {
    return {
      amount: amount1,
      merchant: invoice.split('_')[0],
      orderId: invoice,
      ...meta,
    };
  }
  return null;
};

export default ({ paymentSystem, data }) => {
  switch (paymentSystem) {
    case 'adv-cash':
      return advCashHandler(data);
    case 'payeer':
      return payeerHandler(data);
    case 'coin-payments':
      return coinPaymentsHandler(data);
    default:
      throw new Error('Worong payment system name!');
  }
};
