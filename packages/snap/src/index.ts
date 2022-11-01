import { OnRpcRequestHandler } from '@metamask/snap-types';
import { interpretResult } from './lib/interpretation';
import { simulateTx } from './lib/simulation';

const simulate = async (transaction: any) => {
  const { from, ...rest } = transaction;
  const { result, vm } = await simulateTx(rest, from);
  const interpreted = await interpretResult(vm, result);
  return interpreted;
};

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello': {
      return await simulate(request.params);
    }

    default:
      throw new Error('Method not found.');
  }
};
