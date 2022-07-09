const BUCKET_WALLET_ADDRESSES: string[] = process.env.get(
  "BUCKET_WALLET_ADDRESSES"
)
  ? process.env
      .get("BUCKET_WALLET_ADDRESSES")
      .split(",")
      .map((s) => s.trim())
  : [
      "0xcc21Bc565fED141A434b1730885efbc692A130F9", // localhost
      "0x00574b151CB66D51b444597c6a4BbF1a44eE5fe9", // dev
    ];

export { BUCKET_WALLET_ADDRESSES };
