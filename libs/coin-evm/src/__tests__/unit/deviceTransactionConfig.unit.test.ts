import BigNumber from "bignumber.js";
import { getCryptoCurrencyById, getTokenById } from "@ledgerhq/cryptoassets";
import { makeAccount, makeTokenAccount } from "../fixtures/common.fixtures";
import getDeviceTransactionConfig from "../../deviceTransactionConfig";
import getTransactionStatus from "../../getTransactionStatus";
import { Transaction as EvmTransaction } from "../../types";

const currency = getCryptoCurrencyById("ethereum");
const tokenCurrency = getTokenById("ethereum/erc20/usd__coin");
const tokenAccount = makeTokenAccount("0xkvn", tokenCurrency);
const account = makeAccount("0xkvn", currency, [tokenAccount]);

describe("EVM Family", () => {
  describe("deviceTransactionConfig.ts", () => {
    describe("getDeviceTransactionConfig", () => {
      it("should return the right fields and infos for a coin transaction without mode'", async () => {
        const coinTransaction: EvmTransaction = {
          amount: new BigNumber(100),
          useAllAmount: false,
          subAccountId: "id",
          recipient: "0x997e135e96114c0E84FFc58754552368E4abf329", // celinedion.eth
          feesStrategy: "custom",
          family: "evm",
          mode: "unknown mode" as any,
          nonce: 0,
          gasLimit: new BigNumber(21000),
          chainId: 1,
          maxFeePerGas: new BigNumber(100),
          maxPriorityFeePerGas: new BigNumber(100),
          type: 2,
        };

        const status = await getTransactionStatus(account, coinTransaction);

        expect(
          getDeviceTransactionConfig({
            account,
            parentAccount: undefined,
            transaction: coinTransaction,
            status,
          }),
        ).toEqual([
          { type: "amount", label: "Amount" },
          {
            type: "address",
            label: "Address",
            address: coinTransaction.recipient,
          },
          {
            type: "text",
            label: "Network",
            value: currency.name.replace("Lite", "").trim(),
          },
          { type: "fees", label: "Max fees" },
        ]);
      });

      it("should return the right fields and infos for a coin transaction mode 'send'", async () => {
        const coinTransaction: EvmTransaction = {
          amount: new BigNumber(100),
          useAllAmount: false,
          subAccountId: "id",
          recipient: "0x997e135e96114c0E84FFc58754552368E4abf329", // celinedion.eth
          feesStrategy: "custom",
          family: "evm",
          mode: "send",
          nonce: 0,
          gasLimit: new BigNumber(21000),
          chainId: 1,
          maxFeePerGas: new BigNumber(100),
          maxPriorityFeePerGas: new BigNumber(100),
          type: 2,
        };

        const status = await getTransactionStatus(account, coinTransaction);

        expect(
          getDeviceTransactionConfig({
            account,
            parentAccount: undefined,
            transaction: coinTransaction,
            status,
          }),
        ).toEqual([
          { type: "amount", label: "Amount" },
          {
            type: "address",
            label: "Address",
            address: coinTransaction.recipient,
          },
          {
            type: "text",
            label: "Network",
            value: currency.name.replace("Lite", "").trim(),
          },
          { type: "fees", label: "Max fees" },
        ]);
      });

      it("should return the right fields and infos for a coin transaction mode 'send' with domain", async () => {
        const coinTransaction: EvmTransaction = {
          amount: new BigNumber(100),
          useAllAmount: false,
          subAccountId: "id",
          recipient: "0x997e135e96114c0E84FFc58754552368E4abf329", // celinedion.eth
          feesStrategy: "custom",
          family: "evm",
          mode: "send",
          nonce: 0,
          gasLimit: new BigNumber(21000),
          chainId: 1,
          maxFeePerGas: new BigNumber(100),
          maxPriorityFeePerGas: new BigNumber(100),
          type: 2,
          recipientDomain: {
            address: "0x123",
            domain: "vitalik.eth",
            registry: "ens",
            type: "forward",
          },
        };

        const status = await getTransactionStatus(account, coinTransaction);

        expect(
          getDeviceTransactionConfig({
            account,
            parentAccount: undefined,
            transaction: coinTransaction,
            status,
          }),
        ).toEqual([
          { type: "amount", label: "Amount" },
          {
            type: "text",
            label: "Domain",
            value: coinTransaction.recipientDomain?.domain,
          },
          {
            type: "text",
            label: "Network",
            value: currency.name.replace("Lite", "").trim(),
          },
          { type: "fees", label: "Max fees" },
        ]);
      });

      it("should return the right fields and infos for a token transaction mode 'send'", async () => {
        const tokenTransaction: EvmTransaction = {
          amount: new BigNumber(100),
          useAllAmount: false,
          subAccountId: tokenAccount.id,
          recipient: "0x997e135e96114c0E84FFc58754552368E4abf329", // celinedion.eth
          data: Buffer.from(
            "a9059cbb00000000000000000000000059569e96d0e3d9728dc07bf5c1443809e6f237fd0000000000000000000000000000000000000000000000000c06701668d322ac",
            "hex",
          ),
          feesStrategy: "custom",
          family: "evm",
          mode: "send",
          nonce: 0,
          gasLimit: new BigNumber(21000),
          chainId: 1,
          maxFeePerGas: new BigNumber(100),
          maxPriorityFeePerGas: new BigNumber(100),
          type: 2,
        };
        const status = await getTransactionStatus(account, tokenTransaction);

        expect(
          getDeviceTransactionConfig({
            account: tokenAccount,
            parentAccount: account,
            transaction: tokenTransaction,
            status,
          }),
        ).toEqual([
          { type: "amount", label: "Amount" },
          {
            type: "address",
            label: "Address",
            address: tokenTransaction.recipient,
          },
          {
            type: "text",
            label: "Network",
            value: currency.name.replace("Lite", "").trim(),
          },
          { type: "fees", label: "Max fees" },
        ]);
      });

      it("should return the right fields and infos for a token transaction mode 'send' with domain", async () => {
        const tokenTransaction: EvmTransaction = {
          amount: new BigNumber(100),
          useAllAmount: false,
          subAccountId: tokenAccount.id,
          recipient: "0x997e135e96114c0E84FFc58754552368E4abf329", // celinedion.eth
          data: Buffer.from(
            "a9059cbb00000000000000000000000059569e96d0e3d9728dc07bf5c1443809e6f237fd0000000000000000000000000000000000000000000000000c06701668d322ac",
            "hex",
          ),
          feesStrategy: "custom",
          family: "evm",
          mode: "send",
          nonce: 0,
          gasLimit: new BigNumber(21000),
          chainId: 1,
          maxFeePerGas: new BigNumber(100),
          maxPriorityFeePerGas: new BigNumber(100),
          type: 2,
          recipientDomain: {
            address: "0x123",
            domain: "vitalik.eth",
            registry: "ens",
            type: "forward",
          },
        };
        const status = await getTransactionStatus(account, tokenTransaction);

        expect(
          getDeviceTransactionConfig({
            account: tokenAccount,
            parentAccount: account,
            transaction: tokenTransaction,
            status,
          }),
        ).toEqual([
          { type: "amount", label: "Amount" },
          {
            type: "text",
            label: "Domain",
            value: tokenTransaction.recipientDomain?.domain,
          },
          {
            type: "text",
            label: "Network",
            value: currency.name.replace("Lite", "").trim(),
          },
          { type: "fees", label: "Max fees" },
        ]);
      });

      it("should return the right fields and infos for an NFT transaction mode 'erc721'", async () => {
        const nftTransaction: EvmTransaction = {
          family: "evm",
          mode: "erc721",
          amount: new BigNumber(0),
          useAllAmount: false,
          recipient: "0x8E9eDe486d8208705C67095dd0b4839dEB127132", // pascalgauthier.eth
          feesStrategy: "custom",
          nonce: 0,
          gasLimit: new BigNumber(21000),
          chainId: 1,
          nft: {
            contract: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
            tokenId: "1",
            quantity: new BigNumber(1),
            collectionName: "BAYC",
          },
          maxFeePerGas: new BigNumber(100),
          maxPriorityFeePerGas: new BigNumber(100),
          type: 2,
        };
        const status = await getTransactionStatus(account, nftTransaction);

        expect(
          getDeviceTransactionConfig({
            account: tokenAccount,
            parentAccount: account,
            transaction: nftTransaction,
            status,
          }),
        ).toEqual([
          {
            type: "text",
            label: "Type",
            value: `NFT Transfer`,
          },
          {
            type: "text",
            label: "To",
            value: nftTransaction.recipient,
          },
          {
            type: "text",
            label: "Collection Name",
            value: nftTransaction.nft.collectionName,
          },
          {
            type: "address",
            label: "NFT Address",
            address: nftTransaction.nft.contract,
          },
          {
            type: "text",
            label: "NFT ID",
            value: nftTransaction.nft.tokenId,
          },
          { type: "fees", label: "Max fees" },
        ]);
      });

      it("should return the right fields and infos for an NFT transaction mode 'erc1155'", async () => {
        const nftTransaction: EvmTransaction = {
          family: "evm",
          mode: "erc1155",
          amount: new BigNumber(0),
          useAllAmount: false,
          recipient: "0x8E9eDe486d8208705C67095dd0b4839dEB127132", // pascalgauthier.eth
          feesStrategy: "custom",
          nonce: 0,
          gasLimit: new BigNumber(21000),
          chainId: 1,
          nft: {
            contract: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
            tokenId: "1",
            quantity: new BigNumber(10),
            collectionName: "BAYC",
          },
          maxFeePerGas: new BigNumber(100),
          maxPriorityFeePerGas: new BigNumber(100),
          type: 2,
        };
        const status = await getTransactionStatus(account, nftTransaction);

        expect(
          getDeviceTransactionConfig({
            account: tokenAccount,
            parentAccount: account,
            transaction: nftTransaction,
            status,
          }),
        ).toEqual([
          {
            type: "text",
            label: "Type",
            value: `NFT Transfer`,
          },
          {
            type: "text",
            label: "To",
            value: nftTransaction.recipient,
          },
          {
            type: "text",
            label: "Collection Name",
            value: nftTransaction.nft.collectionName,
          },
          {
            type: "text",
            label: "Quantity",
            value: nftTransaction.nft.quantity.toFixed(),
          },
          {
            type: "address",
            label: "NFT Address",
            address: nftTransaction.nft.contract,
          },
          {
            type: "text",
            label: "NFT ID",
            value: nftTransaction.nft.tokenId,
          },
          { type: "fees", label: "Max fees" },
        ]);
      });
    });
  });
});
