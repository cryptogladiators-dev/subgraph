const BUCKET_WALLET_ADDRESSES_ENV_KEY = "BUCKET_WALLET_ADDRESSES";

export const BUCKET_WALLET_ADDRESSES: string[] = process.env.has(
  BUCKET_WALLET_ADDRESSES_ENV_KEY
)
  ? process.env
      .get(BUCKET_WALLET_ADDRESSES_ENV_KEY)
      .split(",")
      .map<string>((s) => s.trim())
  : [
      "0xcc21Bc565fED141A434b1730885efbc692A130F9", // localhost
      "0x00574b151CB66D51b444597c6a4BbF1a44eE5fe9", // dev
    ];
