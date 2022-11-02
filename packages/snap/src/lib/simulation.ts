import { EthereumProvider } from 'ganache';

export const simulateTx = async (provider: EthereumProvider, tx: any) => {
  const hash = await provider.request({
    method: 'eth_sendTransaction',
    params: [tx],
  });
  return await provider.request({
    method: 'eth_getTransactionReceipt',
    params: [hash],
  });
};
