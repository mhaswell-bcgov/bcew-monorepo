/** @typedef {[string, Record<string, unknown>?]} CardTemplateEntry */

export const CARD_BLOCK = 'bcew-blocks/card';
export const MIN_CARD_SLOTS = 2;
export const MAX_CARD_SLOTS = 6;
/** Default card count for new Cards blocks (keep block.json in sync). */
export const DEFAULT_CARD_COUNT = 2;

/**
 * Selectable card content types, mapped to the block each one renders.
 * The keys are stored on the card's `contentType` attribute.
 */
export const CARD_CONTENT_TYPES = {
    'icon-text': 'bcew-blocks/icon-text-block',
    'media-text': 'bcew-blocks/media-text-layout',
};

/** Default content type used when a card is first created. */
export const DEFAULT_CARD_CONTENT_TYPE = 'icon-text';

/** Blocks allowed inside each card slot, derived from the content type map. */
export const ALLOWED_CARD_BLOCKS = Object.values( CARD_CONTENT_TYPES );

/**
 * Inner-block template for a card of the given content type.
 *
 * @param {string} contentType Card content type key.
 * @return {CardTemplateEntry[]} Inner-block template.
 */
export const getCardContentTemplate = ( contentType ) => [
    [
        CARD_CONTENT_TYPES[ contentType ] ??
            CARD_CONTENT_TYPES[ DEFAULT_CARD_CONTENT_TYPE ],
    ],
];
