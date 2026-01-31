export type ContentItem =
  | { type: "text"; content: string }
  | { type: "image"; src: string };

export type CardItem = {
  name: string;
  image?: string | null;
};
