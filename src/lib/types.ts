/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

export interface File {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[];
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  publish_details: PublishDetails;
  $: any;
}

export interface Block {
  _version?: number;
  _metadata: any;
  $: any;
  title?: string;
  copy?: string;
  image?: File | null;
  layout?: ("image_left" | "image_right") | null;
}

export interface Blocks {
  block: Block;
}

export interface Page {
  uid: string;
  $: any;
  _version?: number;
  title: string;
  url?: string;
  description?: string;
  image?: File | null;
  rich_text?: string;
  blocks?: Blocks[];
}
