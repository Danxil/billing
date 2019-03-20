const advCashHandler = (data) => {
  const { ac_amount, ac_order_id } = data;
  const meta = Object.entries(data)
  .filter(item => item[0].indexOf('ac_') !== 0)
  .reduce((prev, item) => ({ ...prev, [item[0]]: item[1] }), {});
  return {
    amount: parseFloat(ac_amount),
    orderId: ac_order_id,
    ...meta,
  };
};
const payeerHandler = (data) => {
  const { m_amount, m_orderid, m_params: mParams } = data;
  const meta = mParams ? JSON.parse(mParams).reference : { reference: {} };
  return {
    amount: parseFloat(m_amount),
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
      amount: parseFloat(amount1),
      merchant: invoice.split('_')[0],
      orderId: invoice,
      ...meta,
    };
  }
  return null;
};
const perfectMoneyHandler = (data) => {
  const { PAYMENT_AMOUNT, PAYMENT_ID, ...others } = data;
  const meta = Object.entries(others)
  .filter(item => item[0].indexOf('custom_') === 0)
  .reduce((prev, item) => ({ ...prev, [item[0]]: item[1] }), {});
  return {
    amount: parseFloat(PAYMENT_AMOUNT),
    merchant: PAYMENT_ID.split('_')[0],
    orderId: PAYMENT_ID,
    ...meta,
  };
};

export default ({ paymentSystem, data }) => {
  switch (paymentSystem) {
    case 'adv-cash':
      return advCashHandler(data);
    case 'payeer':
      return payeerHandler(data);
    case 'coin-payments':
      return coinPaymentsHandler(data);
    case 'perfect-money':
      return perfectMoneyHandler(data);
    default:
      throw new Error('Worong payment system name!');
  }
};
