import { RunTxResult } from '@ethereumjs/vm/dist/runTx';
import { bufferToHex } from 'ethereumjs-util';
import VM from '@ethereumjs/vm';
import { decodeTokenTransfers } from './tokens';

export const interpretResult = async (vm: VM, result: RunTxResult) => {
  const logs = result.execResult.logs?.map((l) => ({
    address: bufferToHex(l[0]),
    topics: l[1].map(bufferToHex),
    data: bufferToHex(l[2]),
  }));
  const tokenTransfers = await decodeTokenTransfers(vm, logs);
  const status = result.receipt.status ? 'success' : 'reverted';
  const gasUsed = result.gasUsed.toString(10);
  return { logs, status, gasUsed, tokenTransfers };
};
