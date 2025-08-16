export interface Item {
  item_uuid: string;
  title: string;
  description: string;
  bounty: number;
  status: string;
  category: string;
  posted_by: string;
  created_at: string;
  image_urls: string[];
  found_at: string;
}

export interface ImageSearchResult {
  description: string,
  image_url: string,
  item_id: string,
  score: number,
  // total_items_in_index: number,
}