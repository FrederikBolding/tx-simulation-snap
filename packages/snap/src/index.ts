import { OnTransactionHandler } from '@metamask/snap-types';
import { formatUnits } from '@ethersproject/units';
import memdown from 'memdown';
import Ganache from 'ganache';
import { interpretResult } from './lib/interpretation';
import { simulateTx } from './lib/simulation';

const simulate = async (transaction: any) => {
  const provider = Ganache.provider({
    fork: { provider: (window as any).wallet },
    database: { db: memdown() },
    wallet: {
      totalAccounts: 0,
      unlockedAccounts: [transaction.from],
    },
    miner: { blockTime: 0 },
  });
  const receipt = await simulateTx(provider, transaction);
  const interpreted = await interpretResult(provider, receipt);
  const erc20s = interpreted.tokenTransfers.erc20Transfers.reduce(
    (acc, { value, decimals, symbol, from: tokenFrom, to }, idx) => ({
      ...acc,
      [`ERC20 Transfer ${idx + 1}`]: `Transferred ${formatUnits(
        value,
        decimals,
      )} ${symbol} ${tokenFrom} -> ${to}`,
    }),
    {},
  );
  const erc721s = interpreted.tokenTransfers.erc721Transfers.reduce(
    (acc, { from: tokenFrom, to, tokenId, name }, idx) => ({
      ...acc,
      [`ERC721 Transfer ${
        idx + 1
      }`]: `Transferred ${name} (${tokenId}) ${tokenFrom} -> ${to}`,
    }),
    {},
  );
  const insights = {
    'Simulation Result': interpreted.status,
    'Gas Used': interpreted.gasUsed,
    ...erc20s,
    ...erc721s,
  };
  return insights;
};

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  const { gas: gasLimit, ...rest } = transaction;
  return { insights: await simulate({ ...rest, gasLimit }) };
};
