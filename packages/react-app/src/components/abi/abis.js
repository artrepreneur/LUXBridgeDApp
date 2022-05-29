import ERC20WrappedAssetAbi from "./abis/Erc20WrappedAsset.json";
import LuxBTCAbi from "./abis/LuxBTC.json";
import LuxETHAbi from "./abis/LuxETH.json";
import TeleportAbi from "./abis/MultiTeleportBridge.json";

const abis = {
  ERC20WrappedAsset: ERC20WrappedAssetAbi,
  LBTC: LuxBTCAbi,
  LETH: LuxETHAbi,
  //LUSD:
  Teleport: TeleportAbi
};

export default abis;
