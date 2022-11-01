import VM from "@ethereumjs/vm";
import { decodeERC20Transfers } from "./erc20";
import { decodeERC721Transfers } from "./erc721";

export const decodeTokenTransfers = async (vm: VM, logs: any) => {
  const erc20Transfers = await decodeERC20Transfers(vm, logs);
  const erc721Transfers = await decodeERC721Transfers(vm, logs);

  return { erc20Transfers, erc721Transfers };
};
