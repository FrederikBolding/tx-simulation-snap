import { EthereumProvider } from 'ganache';
import { decodeTokenTransfers } from './tokens';

export const interpretResult = async (
  provider: EthereumProvider,
  receipt: any,
) => {
  const { logs } = receipt;
  const tokenTransfers = await decodeTokenTransfers(provider, logs);
  const status = receipt.status ? 'success' : 'reverted';
  const gasUsed = receipt.gasUsed.toString(10);
  return { logs, status, gasUsed, tokenTransfers };
};
