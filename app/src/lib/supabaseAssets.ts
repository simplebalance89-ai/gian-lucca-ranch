export const ASSET_BASE = 'https://udbgzgntfiytnuajnbvy.supabase.co/storage/v1/object/public/ranch-assets';

export const assetUrl = (filename: string): string => `${ASSET_BASE}/${filename}`;
