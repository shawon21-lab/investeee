declare interface CloudinaryUploadResultType {
  event: string;
  info: {
    id: string;
    batchId: string;
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: "png" | "jpeg" | string;
    resource_type: "image" | "video" | string;
    created_at: string;
    tags: string[] | number[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: "";
    access_mode: string;
    original_filename: string;
    path: string;
    thumbnail_url: string;
  };
}
