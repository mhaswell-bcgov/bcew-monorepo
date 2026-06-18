/**
 * WordPress dependencies
 */
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    store as blockEditorStore,
} from '@wordpress/block-editor';
/* eslint-disable import/no-extraneous-dependencies -- @wordpress/components is provided in the monorepo workspace */
import { PanelBody, SelectControl } from '@wordpress/components';
/* eslint-enable import/no-extraneous-dependencies */
import { useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

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
 * @param {Object}   props               Block props.
 * @param {string}   props.clientId      Block client ID.
 * @param {Object}   props.attributes    Persisted attributes.
 * @param {Function} props.setAttributes Updates attributes.
 * @return {import('react').ReactElement} Editor element.
 */
const Edit = ( { clientId, attributes, setAttributes } ) => {
    const { contentType } = attributes;
    const normalizedType = CARD_CONTENT_TYPES[ contentType ]
        ? contentType
        : DEFAULT_CARD_CONTENT_TYPE;

    const { replaceInnerBlocks } = useDispatch( blockEditorStore );

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

    const onChangeContentType = ( value ) => {
        setAttributes( { contentType: value } );
        replaceInnerBlocks(
            clientId,
            [ createBlock( CARD_CONTENT_TYPES[ value ] ) ],
            false
        );
    };

    return (
        <>
            <InspectorControls>
                <PanelBody
                    title={ __( 'Card content', 'bcew-blocks' ) }
                    initialOpen
                >
                    <SelectControl
                        label={ __( 'Content type', 'bcew-blocks' ) }
                        value={ normalizedType }
                        options={ [
                            {
                                label: __( 'Icon + Text', 'bcew-blocks' ),
                                value: 'icon-text',
                            },
                            {
                                label: __( 'Image + Text', 'bcew-blocks' ),
                                value: 'media-text',
                            },
                        ] }
                        onChange={ onChangeContentType }
                        __nextHasNoMarginBottom
                    />
                </PanelBody>
            </InspectorControls>
            <div { ...blockProps }>
                <div { ...innerBlocksProps } />
            </div>
        </>
    );
};

export default Edit;
