
import axios from "axios";

// We'll use the NFT.Storage API for IPFS uploads
// In production, you'd want to use an environment variable for this
const NFT_STORAGE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI3QWIwMTBCMEU2NmIzRWFDQ0E3NDhEN2IwMDBCMEJiN0FiQjI4QUIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxNzY5NzU2MDE4MywibmFtZSI6Ik5GVExhdW5jaFBhZCJ9.wjnaUmX20z_LxCg5dQYAXj0_N62b3sYQFP14X2QtzOc";

export interface IPFSUploadResponse {
  cid: string;
  url: string;
}

/**
 * Upload a file to IPFS via NFT.Storage
 */
export async function uploadFileToIPFS(file: File): Promise<IPFSUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("https://api.nft.storage/upload", formData, {
      headers: {
        "Authorization": `Bearer ${NFT_STORAGE_API_KEY}`,
        "Content-Type": "multipart/form-data"
      }
    });

    const cid = response.data.value.cid;
    return {
      cid,
      url: `ipfs://${cid}`
    };
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload file to IPFS");
  }
}

/**
 * Upload JSON metadata to IPFS
 */
export async function uploadJSONToIPFS(metadata: Record<string, any>): Promise<IPFSUploadResponse> {
  try {
    const response = await axios.post(
      "https://api.nft.storage/upload",
      JSON.stringify(metadata),
      {
        headers: {
          "Authorization": `Bearer ${NFT_STORAGE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const cid = response.data.value.cid;
    return {
      cid,
      url: `ipfs://${cid}`
    };
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
}

/**
 * Convert an IPFS URL to an HTTP URL for display
 */
export function ipfsToHttpURL(ipfsUrl: string): string {
  if (!ipfsUrl) return '';
  
  if (ipfsUrl.startsWith('ipfs://')) {
    const cid = ipfsUrl.replace('ipfs://', '');
    return `https://${cid}.ipfs.nftstorage.link`;
  }
  
  return ipfsUrl;
}

/**
 * Get IPFS status for a CID
 */
export async function checkIPFSStatus(cid: string): Promise<boolean> {
  try {
    const response = await axios.get(`https://api.nft.storage/check/${cid}`, {
      headers: {
        "Authorization": `Bearer ${NFT_STORAGE_API_KEY}`
      }
    });
    
    return response.data.value.pin.status === 'pinned';
  } catch (error) {
    console.error("Error checking IPFS status:", error);
    return false;
  }
}
