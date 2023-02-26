// Generated by Xata Codegen 0.22.3. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "feeds",
    columns: [
      { name: "url", type: "string", unique: true },
      { name: "name", type: "string" },
      { name: "added", type: "datetime" },
      { name: "last_fetched", type: "datetime" },
    ],
  },
  {
    name: "blogposts",
    columns: [
      { name: "content", type: "text", notNull: true, defaultValue: "" },
      { name: "title", type: "string", notNull: true, defaultValue: "" },
      { name: "published", type: "datetime" },
      { name: "hook", type: "text", notNull: true, defaultValue: "" },
      { name: "canonical", type: "string" },
      { name: "slug", type: "string", unique: true },
      { name: "cover", type: "string" },
      { name: "keywords", type: "multiple" },
    ],
  },
  { name: "mails", columns: [] },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Feeds = InferredTypes["feeds"];
export type FeedsRecord = Feeds & XataRecord;

export type Blogposts = InferredTypes["blogposts"];
export type BlogpostsRecord = Blogposts & XataRecord;

export type Mails = InferredTypes["mails"];
export type MailsRecord = Mails & XataRecord;

export type DatabaseSchema = {
  feeds: FeedsRecord;
  blogposts: BlogpostsRecord;
  mails: MailsRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Sam-Apostel-s-workspace-rk6t0c.eu-west-1.xata.sh/db/controll-room",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};