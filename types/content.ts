export type ContentItem =
  | { type: "text"; content: string }
  | { type: "image"; src: string };

export type CardItem = {
  name: string;
  image?: string | null;
  shortDescription?: string;
  fields?: Array<{
    label: string;
    value: string;
  }>;
  buttons?: Array<{
    label: string;
    action: "navigate" | "search";
    url: string;
  }>;
};
