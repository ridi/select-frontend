declare module '@ridi/ridi-prosemirror-editor' {
  import { FunctionComponent } from 'react';

  export interface TextContent {
    type: string;
    content: string;
  }
  export interface DecoratorOfContent {
    type: string;
  }
  export interface AttrbuteOfContent {
    [keyName: string]: number | string;
  }

  export interface ArticleContentJSON {
    type: string;
    content: Array<{
      type: string;
      attr?: AttrbuteOfContent;
      marks?: DecoratorOfContent[];
      content: TextContent[] | string;
    }>;
  }
  export const Article: FunctionComponent<{
    json: ArticleContentJSON;
    classes?: string[];
    style?: AttrbuteOfContent;
  }>;
}
