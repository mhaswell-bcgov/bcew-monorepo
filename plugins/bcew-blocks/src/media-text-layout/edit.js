import {
    useBlockProps,
    useInnerBlocksProps,
    InnerBlocks,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import { BaseControl, PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { reconcileOptionalInnerBlocks } from '../utils/optional-inner-blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

const CARDS_BLOCK = 'bcew-blocks/cards';

const TEMPLATE = [
    [ 'core/heading', { level: 3 } ],
    [ 'core/paragraph' ],
    [ 'core/list' ],
    [ 'core/buttons' ],
];

// Canonical position of every inner block, used to re-insert an optional block
// (paragraph/list) back into its correct slot when it is toggled on again.
const BLOCK_ORDER = {
    'core/heading': 0,
    'core/paragraph': 1,
    'core/list': 2,
    'core/buttons': 3,
};

const createParagraph = () => createBlock( 'core/paragraph' );
const createList = () =>
    createBlock( 'core/list', {}, [ createBlock( 'core/list-item' ) ] );

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Persisted attributes.
 * @param {Function} props.setAttributes Updates attributes.
 * @param {string}   props.clientId      Block client ID.
 * @return {Element} Element to render.
 */
const Edit = ( { attributes, setAttributes, clientId } ) => {
    const {
        imagePosition,
        imageId,
        layoutRatio,
        characterLimit,
        showParagraph,
        showList,
    } = attributes;
    const media = useSelect(
        ( select ) => {
            if ( ! imageId ) {
                return null;
            }

            return select( coreStore ).getMedia( imageId );
        },
        [ imageId ]
    );

    // Inside a Cards block the content toggles are controlled once at the row
    // level, so the per-block toggles are hidden to keep a single source of
    // truth.
    const isInsideCards = useSelect(
        ( select ) =>
            select( blockEditorStore ).getBlockParentsByBlockName(
                clientId,
                CARDS_BLOCK
            ).length > 0,
        [ clientId ]
    );

    const innerBlocks = useSelect(
        ( select ) => select( blockEditorStore ).getBlocks( clientId ),
        [ clientId ]
    );
    const { replaceInnerBlocks } = useDispatch( blockEditorStore );

    // Add/remove the optional paragraph and list so they are truly absent from
    // the saved content (and thus the front end) when toggled off.
    useEffect( () => {
        // Wait until the inner-block template has populated. On first render the
        // inner blocks are momentarily empty (before the template seeds them);
        // acting then would replace the whole set with just paragraph/list and
        // clobber the heading/buttons. The heading is always present, so use it
        // as the "template ready" signal.
        if (
            ! innerBlocks.some( ( block ) => 'core/heading' === block.name )
        ) {
            return;
        }
        const nextBlocks = reconcileOptionalInnerBlocks( {
            blocks: innerBlocks,
            optional: {
                'core/paragraph': {
                    show: false !== showParagraph,
                    create: createParagraph,
                },
                'core/list': {
                    show: false !== showList,
                    create: createList,
                },
            },
            order: BLOCK_ORDER,
        } );
        if ( nextBlocks ) {
            replaceInnerBlocks( clientId, nextBlocks, false );
        }
    }, [ showParagraph, showList, innerBlocks, clientId, replaceInnerBlocks ] );
    const styles = {
        '--ratio-image': `${ layoutRatio.image }%`,
        '--ratio-content': `${ layoutRatio.content }%`,
    };
    const blockProps = useBlockProps( {
        className:
            'right' === imagePosition ? 'is-image-right' : 'is-image-left',
        style: styles,
    } );

    const innerBlocksProps = useInnerBlocksProps(
        { className: 'inner-blocks' },
        {
            template: TEMPLATE,
            allowedBlocks: TEMPLATE,
            renderAppender: InnerBlocks.ButtonBlockAppender,
        }
    );

    return (
        <>
            <InspectorControls>
                <PanelBody
                    title={ __( 'Layouts', 'bcew-blocks' ) }
                    initialOpen={ true }
                >
                    <ToggleControl
                        label={ __( 'Image on right', 'bcew-blocks' ) }
                        checked={ 'right' === imagePosition }
                        onChange={ ( value ) =>
                            setAttributes( {
                                imagePosition: value ? 'right' : 'left',
                            } )
                        }
                    />
                    <BaseControl
                        id="media-text-layout-ratio"
                        label={ __( 'Layout Ratio', 'bcew-blocks' ) }
                        help={ __(
                            'The default image/content split.',
                            'bcew-blocks'
                        ) }
                    >
                        <div>
                            { layoutRatio.image } / { layoutRatio.content }
                        </div>
                    </BaseControl>
                    <BaseControl
                        id="media-text-layout-character-limit"
                        label={ __( 'Character Limit', 'bcew-blocks' ) }
                        help={ __(
                            'Maximum recommended character length for headings and paragraphs.',
                            'bcew-blocks'
                        ) }
                    >
                        <div>{ characterLimit }</div>
                    </BaseControl>
                </PanelBody>
                { ! isInsideCards && (
                    <PanelBody
                        title={ __( 'Content', 'bcew-blocks' ) }
                        initialOpen={ false }
                    >
                        <ToggleControl
                            __nextHasNoMarginBottom
                            label={ __( 'Show paragraph', 'bcew-blocks' ) }
                            help={ __(
                                'Turn off to remove the paragraph from this block.',
                                'bcew-blocks'
                            ) }
                            checked={ false !== showParagraph }
                            onChange={ ( value ) =>
                                setAttributes( { showParagraph: value } )
                            }
                        />
                        <ToggleControl
                            __nextHasNoMarginBottom
                            label={ __( 'Show list', 'bcew-blocks' ) }
                            help={ __(
                                'Turn off to remove the list from this block.',
                                'bcew-blocks'
                            ) }
                            checked={ false !== showList }
                            onChange={ ( value ) =>
                                setAttributes( { showList: value } )
                            }
                        />
                    </PanelBody>
                ) }
            </InspectorControls>

            <div { ...blockProps }>
                <div className="layout-shell">
                    <div className="wp-block-image">
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={ ( selectedMedia ) =>
                                    setAttributes( {
                                        imageId: selectedMedia?.id,
                                    } )
                                }
                                allowedTypes={ [ 'image' ] }
                                value={ imageId }
                                render={ ( { open } ) => (
                                    <div
                                        className="image-inner"
                                        role="button"
                                        tabIndex={ 0 }
                                        aria-label={
                                            media
                                                ? __(
                                                      'Replace image',
                                                      'bcew-blocks'
                                                  )
                                                : __(
                                                      'Select image',
                                                      'bcew-blocks'
                                                  )
                                        }
                                        onClick={ open }
                                        onKeyDown={ ( event ) => {
                                            if (
                                                'Enter' === event.key ||
                                                ' ' === event.key
                                            ) {
                                                open();
                                            }
                                        } }
                                    >
                                        { media && media.source_url ? (
                                            <img
                                                src={ media.source_url }
                                                alt={ media.alt_text || '' }
                                            />
                                        ) : (
                                            <div className="image-placeholder">
                                                <h5 className="image-placeholder-title">
                                                    { __(
                                                        'Select an image',
                                                        'bcew-blocks'
                                                    ) }
                                                </h5>

                                                <p className="image-placeholder-help">
                                                    { __(
                                                        'Click to upload',
                                                        'bcew-blocks'
                                                    ) }
                                                </p>
                                            </div>
                                        ) }
                                    </div>
                                ) }
                            />
                        </MediaUploadCheck>
                    </div>
                    <div className="media-text-content">
                        <div { ...innerBlocksProps } />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;
