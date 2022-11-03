import { EthereumProvider } from 'ganache';
import { decodeERC20Transfers } from './erc20';
import { decodeERC721Transfers } from './erc721';

export const decodeTokenTransfers = async (
  provider: EthereumProvider,
  logs: any,
) => {
  const erc20Transfers = await decodeERC20Transfers(provider, logs);
  const erc721Transfers = await decodeERC721Transfers(provider, logs);

  return { erc20Transfers, erc721Transfers };
};
