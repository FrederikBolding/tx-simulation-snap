import { OnTransactionHandler } from '@metamask/snap-types';
import { formatUnits } from '@ethersproject/units';
import memdown from 'memdown';
import Ganache from 'ganache';
import { panel, text, divider } from '@metamask/snaps-ui';
import { interpretResult } from './lib/interpretation';
import { simulateTx } from './lib/simulation';

const simulate = async (transaction: any) => {
  const provider = Ganache.provider({
    fork: { provider: (window as any).ethereum },
    database: { db: memdown() },
    wallet: {
      totalAccounts: 0,
      unlockedAccounts: [transaction.from],
    },
    miner: { blockTime: 0 },
  });
  const receipt = await simulateTx(provider, transaction);
  const interpreted = await interpretResult(provider, receipt);
  const erc20s = interpreted.tokenTransfers.erc20Transfers.map(
    ({ value, decimals, symbol, from: tokenFrom, to }) =>
      panel([
        text(`Transferred ${formatUnits(value, decimals)} ${symbol}`),
        text(`**From:** ${tokenFrom}`),
        text(`**To:** ${to}`),
      ]),
  );
  const erc721s = interpreted.tokenTransfers.erc721Transfers.map(
    ({ from: tokenFrom, to, tokenId, name }) =>
      panel([
        text(`Transferred ${name} (${tokenId})`),
        text(`**From:** ${tokenFrom}`),
        text(`**To:** ${to}`),
      ]),
  );
  return panel([
    text(
      `**Simulation Result:** ${
        interpreted.status === 'success' ? '✔️' : '❌'
      }`,
    ),
    text(`**Gas Used:** ${interpreted.gasUsed}`),
    divider(),
    ...(erc20s.length > 0
      ? [text('**ERC20 transfers**'), ...erc20s, divider()]
      : []),
    ...(erc721s.length > 0
      ? [text('**ERC721 transfers**'), ...erc721s, divider()]
      : []),
    text('*Simulated using Ganache*'),
  ]);
};

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  const { gas: gasLimit, ...rest } = transaction;
  return { content: await simulate({ ...rest, gasLimit }) };
};
