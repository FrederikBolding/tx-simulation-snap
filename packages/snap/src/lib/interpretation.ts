import { hexToBigInt, hexToNumber } from '@metamask/utils';
import { EthereumProvider } from 'ganache';
import { decodeTokenTransfers } from './tokens';

export const interpretResult = async (
  provider: EthereumProvider,
  receipt: any,
) => {
  const { logs } = receipt;
  const tokenTransfers = await decodeTokenTransfers(provider, logs);
  const status = hexToNumber(receipt.status) === 1 ? 'success' : 'reverted';
  const gasUsed = hexToBigInt(receipt.gasUsed).toString(10);
  return { logs, status, gasUsed, tokenTransfers };
};
