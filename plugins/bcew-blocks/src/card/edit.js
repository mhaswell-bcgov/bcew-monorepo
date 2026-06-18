/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
    ALLOWED_CARD_BLOCKS,
    CARD_CONTENT_TYPES,
    DEFAULT_CARD_CONTENT_TYPE,
    getCardContentTemplate,
} from '../cards/constants';

/**
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Persisted attributes.
 * @return {import('react').ReactElement} Editor element.
 */
const Edit = ( { attributes } ) => {
    const { contentType } = attributes;
    const normalizedType = CARD_CONTENT_TYPES[ contentType ]
        ? contentType
        : DEFAULT_CARD_CONTENT_TYPE;

    const blockProps = useBlockProps( { className: 'bcew-blocks-card' } );
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'bcew-blocks-card__content' },
        {
            allowedBlocks: ALLOWED_CARD_BLOCKS,
            template: getCardContentTemplate( normalizedType ),
            templateLock: 'all',
            renderAppender: false,
        }
    );

    return (
        <div { ...blockProps }>
            <div { ...innerBlocksProps } />
        </div>
    );
};

export default Edit;
