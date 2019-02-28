export default ({ system, data, res }) => {
  switch (system) {
    case 'adv-cash':
      return res.send(200);
    case 'payeer':
      return res.status(200).send(`${data.m_orderid}|success`);
    default:
      throw new Error('Worong payment system name!');
  }
};
