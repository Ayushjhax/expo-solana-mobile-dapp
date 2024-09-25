import { 
  Connection, 
  clusterApiUrl, 
  PublicKey, 
  Keypair 
} from "@solana/web3.js";
import { 
  Metaplex, 
  keypairIdentity, 
  Nft 
} from "@metaplex-foundation/js";

interface Attribute {
  trait_type: string;
  value: number;
}
interface Metadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  payer: string; 
  attributes: Attribute[];
}

export async function mintNFT(
  metadata: Metadata, 
  wallet: Keypair, 
  network: "devnet" | "mainnet-beta" = "devnet" 
): Promise<Nft> {
  try {
    if (!wallet || !wallet.publicKey) {
      throw new Error("Wallet is not connected or invalid.");
    }

    if (!metadata.name || !metadata.symbol || !metadata.image) {
      throw new Error("Invalid metadata: 'name', 'symbol', and 'image' are required.");
    }

    const connection = new Connection(clusterApiUrl(network));

    const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));

    const { name, symbol, description, image, attributes } = metadata;

    const { nft } = await metaplex.nfts().create({
      uri: image,
      name,
      symbol,
      sellerFeeBasisPoints: 500,
      creators: [{ address: wallet.publicKey.toBase58(), share: 100 }], 
    });

    console.log("NFT Minted Successfully:", nft);
    return nft;
  } catch (error) {
    console.error("Error minting NFT:", error.message);
    throw error;
  }
}