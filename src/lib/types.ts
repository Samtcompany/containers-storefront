/** The configuration envelope Aamer publishes (ADR 0038 §3.2). Content inside a section is free-form. */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export interface Section { id: string; enabled: boolean; order: number; fields: JsonObject; items: JsonValue[] }
export interface StorefrontConfig {
  site: JsonObject; brand: JsonObject; contact: JsonObject; sections: Section[]; calculator: JsonObject; assistant: JsonObject;
}
export interface PublishedStorefront {
  slug: string; versionId: string; versionNo: number; publishedAt: string; config: StorefrontConfig; products: JsonValue[];
}
export type Lang = 'ar' | 'en';
