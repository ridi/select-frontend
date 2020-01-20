import { AllHtmlEntities } from 'html-entities';
import * as htmlToText from 'html-to-text';
import ellipsis from 'text-ellipsis';

const MAX_DESCRIPTION_LENGTH = 175;
const entities = new AllHtmlEntities();

export const ellipsisDescription = (description: string) =>
  ellipsis(
    entities.decode(htmlToText.fromString(description, { wordwrap: null }))
      .replace('<', '〈')
      .replace('>', '〉'),
    MAX_DESCRIPTION_LENGTH,
  );
