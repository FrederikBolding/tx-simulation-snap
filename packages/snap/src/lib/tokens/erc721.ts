import { decodeSingle } from '@metamask/abi-utils';
import { EthereumProvider } from 'ganache';

const getName = async (provider: EthereumProvider, address: string) => {
  const result = await provider.request({
    method: 'eth_call',
    params: [
      {
        to: address,
        data: '0x06fdde03',
      },
    ],
  });
  const decoded = decodeSingle('string', result as `0x${string}`);
  return decoded;
};

export const decodeERC721Transfers = async (
  provider: EthereumProvider,
  logs: any,
) => {
  try {
    return await Promise.all(
      logs
        .filter(
          (log) =>
            log.decoded?.name === 'Transfer' ||
            log.topics[0] ===
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        )
        .map(async (log) => {
          const from = decodeSingle('address', log.topics[1]);
          const to = decodeSingle('address', log.topics[2]);
          const tokenId = decodeSingle('uint256', log.topics[3]).toString(10);
          const name = await getName(provider, log.address);
          return { from, to, tokenId, name };
        }),
    );
  } catch {
    return [];
  }
};
